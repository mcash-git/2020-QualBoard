/* global $ */
import 'datatables.net-bs4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.css';
import debounce from 'lodash.debounce';
import { Api } from 'api/api';
import { AppConfig } from 'app-config';
import { OidcWrapper } from 'shared/auth/oidc-wrapper';
import { Router } from 'aurelia-router';
import { CurrentUser } from 'shared/current-user';
import { DateTimeService } from 'shared/components/date-time-service';
import sanitizeUserHtml from 'shared/utility/security/sanitize-user-html';

export class ProjectsTable {
  static inject = [AppConfig, OidcWrapper, Router, CurrentUser, DateTimeService, Api];

  constructor(appConfig, auth, router, currentUser, dateTimeService, api) {
    this.appConfig = appConfig;
    this.auth = auth;
    this.router = router;
    this.currentUser = currentUser;
    this.dateTimeService = dateTimeService;
    this.api = api;
  }

  attached() {
    this.table = $('#su-projs-table').DataTable({
      serverSide: true,
      searching: true,
      stateSave: true,
      pagingType: 'numbers',
      ajax: debounce((data, callback) => {
        const query = {
          page: (data.start / data.length) + 1,
          pageSize: data.length,
        };

        if (data.order.length > 0) {
          const sort = data.order[0];
          query.sort = `${data.columns[sort.column].name}-${sort.dir}`;
        }

        if (data.search.value.length > 0) {
          query.search = data.search.value;
        }

        this.api.query.projects.allProjects(query)
          .then(response => {
            callback({
              recordsTotal: response.totalItems,
              recordsFiltered: response.totalItems,
              data: response.items,
            });
          });
      }, 300),
      columns: [
        {
          data: 'privateName',
          title: 'Private Name',
          name: 'privateName',
          render: (data) => `<a href="" onclick="return false">${sanitizeUserHtml(data)}</a>`,
        },
        {
          data: 'publicName',
          title: 'Public Name',
          name: 'publicName',
          render: (data) => `<a href="" onclick="return false">${sanitizeUserHtml(data)}</a>`,
        },
        {
          data: 'accountName',
          title: 'Account Name',
          name: 'accountName',
          render: (data) => ((data !== null) ?
            `<a href="" onclick="return false">${sanitizeUserHtml(data)}</a>` :
            ''),
        },
        {
          data: 'openTime',
          title: 'Open Date',
          searchable: false,
          name: 'openTime',
          render: data => this.dateTimeService
            .fromUtc(data, this.currentUser.timeZone, 'MM/DD/YYYY h:mm a'),
        },
        {
          data: 'closeTime',
          title: 'Close Date',
          searchable: false,
          name: 'closeTime',
          render: data => this.dateTimeService
            .fromUtc(data, this.currentUser.timeZone, 'MM/DD/YYYY h:mm a'),
        },
        {
          data: 'totalResponseCount',
          title: 'Post Count',
          name: 'totalResponseCount',
          orderable: false,
          searchable: false,
        },
        {
          data: 'projectUserCount',
          title: 'User Count',
          name: 'projectUserCount',
          searchable: false,
        },
      ],
    });

    $('#su-projs-table tbody').on('click', 'td', (e) => {
      const rData = this.table.row(e.currentTarget).data();
      const cell = this.table.cell(e.currentTarget).index();

      // project column
      if (cell.column === 0 || cell.column === 1) {
        this.router.navigate(`#/super/accounts/${rData.accountId}/projects/${
          rData.id}`);
      } else if (cell.column === 2) {
        this.router.navigate(`#/super/accounts/${rData.accountId}`);
      }
    });
  }

  deactivate() {
    this.table.destroy();
  }
}
