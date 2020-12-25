/* global $ */
import { DialogService } from 'aurelia-dialog';
import 'datatables.net-bs4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.css';
import debounce from 'lodash.debounce';
import { AppConfig } from 'app-config';
import { ViewState } from 'shared/app-state/view-state';
import { ChildViewState } from 'shared/app-state/child-view-state';
import { OidcWrapper } from 'shared/auth/oidc-wrapper';
import { Router } from 'aurelia-router';
import { Api } from 'api/api';
import sanitizeUserHtml from 'shared/utility/security/sanitize-user-html';

const actionBarModulePath = 'researcher/super/accounts/accounts-table-action-bar';

export class AccountsTable {
  static inject = [
    DialogService,
    AppConfig,
    OidcWrapper,
    Router,
    ViewState,
    Api,
  ];

  constructor(dialogService, appConfig, auth, router, viewState, api) {
    this.dialogService = dialogService;
    this.appConfig = appConfig;
    this.auth = auth;
    this.router = router;
    this.viewState = viewState;
    this.api = api;
  }

  activate() {
    this.viewState.childStateStack.push(new ChildViewState({
      actionBarViewModel: actionBarModulePath,
      actionBarModel: this,
    }));
  }

  deactivate() {
    this.viewState.childStateStack.pop();
  }

  attached() {
    this.table = $('#su-accnts-table').DataTable({
      serverSide: true,
      searching: false,
      pagingType: 'numbers',
      stateSave: true,
      order: [[0, 'asc']],
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

        this.api.query.accounts.allAccounts(query)
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
          data: 'name',
          name: 'Name',
          title: 'Account Name',
          render: (data) => `<a href="" onclick="return false">${sanitizeUserHtml(data)}</a>`,
        },
        {
          data: 'id',
          title: 'Id',
          name: 'Id',
        },
      ],
    });

    $('#su-accnts-table tbody').on('click', 'td', (e) => {
      const rData = this.table.row(e.currentTarget).data();
      const cell = this.table.cell(e.currentTarget).index();

      // project column
      if (cell.column === 0) {
        this.router.navigate(`#/super/accounts/${rData.id}`);
      }
    });
  }

  handleAccountAdded() {
    this.table.ajax.reload();
  }
}
