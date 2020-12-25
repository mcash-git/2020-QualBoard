import { AnalyticsClient } from '2020-analytics';
import { Api } from 'api/api';
import { CurrentUserRole } from 'shared/current-user-role';
import { ViewState } from 'shared/app-state/view-state';
import { ChildViewState } from 'shared/app-state/child-view-state';

export class ProjectSettings {
  static inject = [Api, AnalyticsClient, CurrentUserRole, ViewState];

  constructor(api, analyticsClient, userRole, viewState) {
    this.api = api;
    this.analyticsClient = analyticsClient;
    this.userRole = userRole;
    this.viewState = viewState;
  }

  async activate(params) {
    this.project = await this.api.query.projects.get(params.projectId);
    this.selectedTier = (await this.analyticsClient.getAnalyticsProject(params.projectId)).tier;
    this.childViewState = new ChildViewState({
      sidebarOpen: false,
    });
    this.viewState.childStateStack.push(this.childViewState);
  }
}
