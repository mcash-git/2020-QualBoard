/* global $ */
import 'datatables.net-bs4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.css';

import { renderSafe } from 'shared/utility/datatables-utilities';
import { OidcWrapper } from 'shared/auth/oidc-wrapper';
import { AppConfig } from 'app-config';
import { DateTimeService } from 'shared/components/date-time-service';
import { CurrentUser } from 'shared/current-user';
import { bindable, bindingMode } from 'aurelia-framework';
import { Api } from 'api/api';
import { ReportService } from 'researcher/project/reports/report-service';
import { DialogService } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { enums } from '2020-qb4';

const ReportTypes = enums.reportTypes;
const ReportFileTypes = enums.reportFileTypes;

export class ReportConfigTable {
  @bindable({ defaultBindingMode: bindingMode.oneWay }) projectId;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) accountId;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) reports;

  static inject = [
    OidcWrapper,
    AppConfig,
    DateTimeService,
    CurrentUser,
    Api,
    ReportService,
    DialogService,
    EventAggregator,
  ];

  constructor(
    auth,
    appConfig,
    dateTimeService,
    currentUser,
    api,
    reportService,
    dialogService,
    eventAggregator,
  ) {
    this.auth = auth;
    this.appConfig = appConfig;
    this.dateTimeService = dateTimeService;
    this.currentUser = currentUser;
    this.api = api;
    this.reportService = reportService;
    this.modalService = dialogService;
    this.ea = eventAggregator;
  }

  async attached() {
    this.subscriptions = [
      this.ea.subscribe('reload-data-table', () => {
        this.table.ajax.reload();
      }),
    ];

    await this.getProjectUsers(this.projectId);
    this.buildTable();

    $('#reports-table tbody').on('click', 'td', (e) => {
      const rData = this.table.row(e.currentTarget).data();
      const cell = this.table.cell(e.currentTarget).index();

      // remove cell
      if (cell.column === 5) {
        this.remove(rData);
      }

      // edit cell
      if (cell.column === 6) {
        this.edit(rData);
      }

      // generate cell
      if (cell.column === 7) {
        if (rData.generateDisabled) {
          return;
        }
        rData.generateDisabled = true;
        this.reportService.generateReport(rData);
        this.showSpinner(rData.id);


        setTimeout(() => {
          rData.generateDisabled = false;
          this.hideSpinner(rData.id);
        }, 5000);
      }
    });
  }

  showSpinner(configId) {
    const iconElement = document.querySelector(`#icon-${configId}`);
    const spinnerElement = document.querySelector(`#spinner-${configId}`);
    iconElement.style.display = 'none';
    spinnerElement.style.display = 'inline-block';
  }

  hideSpinner(configId) {
    const iconElement = document.querySelector(`#icon-${configId}`);
    const spinnerElement = document.querySelector(`#spinner-${configId}`);
    iconElement.style.display = 'block';
    spinnerElement.style.display = 'none';
  }

  async getProjectUsers(projectId) {
    this.users = await this.api.query.projectUsers.getProjectUsers(projectId);
  }

  buildTable() {
    this.table = $('#reports-table').DataTable({
      serverSide: true,
      searching: false,
      stateSave: true,
      lengthChange: false,
      pagingType: 'numbers',
      ajax: {
        url: `${this.appConfig.api.url}reporting/projects/${this.projectId}/configuration/datatables`,
        type: 'GET',
        beforeSend: request => {
          request.setRequestHeader('Authorization', `Bearer ${this.auth.accessToken}`);
        },
      },
      columns: [
        {
          data: 'name',
          title: 'Name',
          name: 'name',
          render: renderSafe((data) => data),
        },
        {
          data: 'reportType',
          title: 'Report Type',
          name: 'reportType',
          render: renderSafe((data) => ReportTypes[data].friendly),
        },
        {
          data: 'fileType',
          title: 'File Type',
          name: 'fileType',
          render: renderSafe((data) => ReportFileTypes[data].friendly),
        },
        {
          data: 'createdOn',
          title: 'Created',
          name: 'createdOn',
          render: renderSafe((data) => this.dateTimeService
            .fromUtc(data, this.currentUser.timeZone, 'MM/DD/YYYY')),
        },
        {
          data: 'createdBy',
          title: 'Created By',
          name: 'createdBy',
          render: renderSafe((data) => {
            const user = this.users.find(u => data === u.userId);
            if (user && user.firstName && user.lastName) {
              return `${user.firstName} ${user.lastName}`;
            }
            return '';
          }),
        },
        {
          data: null,
          title: 'Remove',
          name: 'remove',
          className: 'center-column',
          render: () => '<i class="icon-remove_circle_outline remove-icon"></i>',
          sortable: false,
        },
        {
          data: null,
          title: 'Edit',
          name: 'edit',
          className: 'center-column',
          render: () => '<i class="icon-mode_edit action-icons"></i>',
          sortable: false,
        },
        {
          data: null,
          title: 'Generate',
          name: 'generate',
          className: 'center-column',
          render: (data, type, row) => `<i class="icon-download action-icons" id="icon-${row.id}"></i><div id="spinner-${row.id}" class="rolling-spinner" style="width:20px; height:20px; margin:0px; display: none" />`,
          sortable: false,
        },
      ],
      order: [[3, 'desc']],
    });
  }

  confirmation(msg) {
    const response = confirm(msg); // eslint-disable-line
    if (response) {
      return true;
    }
    return false;
  }

  async remove(data) {
    this.modalService.open({
      viewModel: 'shared/components/confirmation-modal',
      model: {
        text: `Are you sure you want to delete the ${data.name} report configuration from the system?`,
        title: 'Delete Confirmation',
        confirmButtonClass: 'btn-danger',
        confirmButtonText: 'Delete',
        cancelButtonClass: 'btn-outline-secondary',
      },
    }).whenClosed(result => {
      if (result.wasCancelled) {
        return;
      }
      this.removeReport(data);
    });
  }

  async removeReport(data) {
    await this.reportService.deleteReport(data.id, this.projectId);
    this.ea.publish('fetch-reports');
  }

  async edit(data) {
    const result = this.modalService.open({
      viewModel: 'researcher/project/reports/report-modal/report-modal',
      model: {
        projectId: this.projectId,
        accountId: this.accountId,
        report: data,
      },
    });

    if (result.wasCancelled) {
      return; // eslint-disable-line
    }
  }

  fetchReportTypeName(row) {
    let name = '';
    switch (row.reportType) {
      case 0:
        name = 'crosstab';
        break;
      case 1:
        name = 'transcript';
        break;
      default:
        break;
    }
    return name;
  }

  reloadDataTable() {
    this.table.ajax.reload();
  }

  detached() {
    this.table.destroy();
  }
}
