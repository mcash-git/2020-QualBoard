import { DialogService } from 'aurelia-dialog';
import { Api } from 'api/api';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ViewState } from 'shared/app-state/view-state';
import { ChildViewState } from 'shared/app-state/child-view-state';

const actionBarModulePath = 'researcher/project/reports/report-action-bar';

export class Reports {
  static inject = [DialogService, Api, EventAggregator, ViewState];

  constructor(dialogService, api, ea, viewState) {
    this.modalService = dialogService;
    this.api = api;
    this.ea = ea;
    this.viewState = viewState;

    this.isResponses = true;
    this.reports = [];
    this.subscriptions = [];
  }

  canActivate(params) {
    this.projectId = params.projectId;
    this.accountId = params.accountId;

    this.fetchReports();
  }

  activate() {
    this.state = new ChildViewState({
      actionBarViewModel: actionBarModulePath,
      actionBarModel: this,
    });
    this.viewState.childStateStack.push(this.state);

    this.subscriptions = [
      this.ea.subscribe('fetch-reports', this.fetchReports.bind(this)),
    ];
  }

  async openReportCreation() {
    const result = this.modalService.open({
      viewModel: 'researcher/project/reports/report-modal/report-modal',
      model: {
        projectId: this.projectId,
        accountId: this.accountId,
      },
    });

    if (result.wasCancelled) {
      return; // eslint-disable-line
    }
  }

  async fetchReports() {
    const hadReports = this.hasReportItems;
    this.reports = await this.api.query.reporting.getReports(this.projectId);

    if (hadReports) {
      await this.ea.publish('reload-data-table');
    }
  }

  get hasReportItems() {
    return (this.reports && this.reports.items && this.reports.items.length > 0);
  }

  deactivate() {
    this.subscriptions.forEach(s => s.dispose());
    this.subscriptions = [];
    this.viewState.childStateStack.pop();
  }
}
