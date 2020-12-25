import { Api } from 'api/api';
import { ViewState } from 'shared/app-state/view-state';
import { ParentViewState } from 'shared/app-state/parent-view-state';
import { participantStore } from 'participant/state/participant-store';
import configureUnknownRoutes from 'shared/utility/configure-unknown-routes';

// TODO:  Change this over to a router-view and add tabs to content-header
export class ParticipantProjectDashboard {
  static inject = [Api, ViewState];

  constructor(api, viewState) {
    this.api = api;
    this.viewState = viewState;
  }

  activate() {
    this.parentViewState = new ParentViewState({
      backButtonRoute: '/#/',
      titleIcon: 'icon-folder',
      navItems: this.router.navigation,
      shouldShowContentHeader: false,
      isParticipantRoute: true,
    });

    this.viewState.parentStateStack.push(this.parentViewState);

    const handleStateChange = () => {
      const { project } = participantStore.getState();

      this.parentViewState.title = project && project.name;
    };

    this.unsubscribeFromStore = participantStore.subscribe(handleStateChange);
    handleStateChange();
  }

  deactivate() {
    this.viewState.parentStateStack.pop();
  }

  unbind() {
    if (this.unsubscribeFromStore) {
      this.unsubscribeFromStore();
    }
  }

  configureRouter(config, router) {
    config.map([
      {
        route: ['', 'active'],
        name: 'active-events',
        moduleId: 'participant/project/dashboard/participant-project-dashboard-container',
        nav: true,
        title: 'Active',
        settings: { eventFilter: 'ACTIVE', class: 'no-hide', iconClass: 'icon-ion-calendar' },
      },
      {
        route: ['inactive'],
        name: 'inactive-events',
        moduleId: 'participant/project/dashboard/participant-project-dashboard-container',
        nav: true,
        title: 'Inactive',
        settings: { eventFilter: 'INACTIVE', class: 'no-hide', iconClass: 'icon-schedule' },
      },
    ]);

    configureUnknownRoutes(config);
    this.router = router;
  }
}
