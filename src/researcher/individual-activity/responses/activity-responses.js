import { ViewState } from 'shared/app-state/view-state';
import configureUnknownRoutes from 'shared/utility/configure-unknown-routes';
import { ChildViewState } from 'shared/app-state/child-view-state';

export class ActivityResponses {
  static inject = [
    ViewState,
  ];

  constructor(viewState) {
    this.viewState = viewState;
  }

  async activate() {
    this.viewState.childStateStack.push(new ChildViewState({
      actionBarViewModel: 'researcher/individual-activity/responses/responses-action-bar',
      actionBarModel: {
        router: this.router,
        subViewModel: null,
        subModel: null,
      },
      fullHeight: true,
      actionBarClass: 'responses-action-bar',
    }));
  }

  deactivate() {
    this.viewState.childStateStack.pop();
  }

  configureRouter(config, router) {
    config.map([{
      route: ['', 'entries'],
      name: 'entries',
      moduleId: './entries/activity-entries',
      nav: true,
      title: 'Entries',
      settings: {
        iconClass: 'icon-library_books',
      },
    }, {
      route: ['tasks'],
      name: 'activity-tasks',
      moduleId: './activity-tasks',
      nav: true,
      title: 'Tasks',
      settings: {
        iconClass: 'icon-person',
      },
    }]);

    configureUnknownRoutes(config);
    this.router = router;
  }
}
