import { ViewState } from 'shared/app-state/view-state';
import { ParentViewState } from 'shared/app-state/parent-view-state';
import configureUnknownRoutes from 'shared/utility/configure-unknown-routes';

export class Super {
  static inject = [ViewState];

  constructor(viewState) {
    this.viewState = viewState;
  }

  activate() {
    this.viewState.parentStateStack.push(new ParentViewState({
      title: 'Super User Area',
      titleIcon: 'icon-account_box',
      navItems: this.router.navigation,
      isResearcherRoute: true,
    }));
  }

  deactivate() {
    this.viewState.parentStateStack.pop();
  }

  configureRouter(config, router) {
    config.map([
      {
        route: ['', 'projects'],
        name: 'su-projects',
        moduleId: 'researcher/super/projects/projects-table',
        nav: true,
        title: 'Active Projects',
        settings: {
          iconClass: 'icon-folder',
        },
      },
      {
        route: ['accounts'],
        name: 'su-accounts',
        moduleId: 'researcher/super/accounts/accounts-table',
        nav: true,
        title: 'Accounts',
        settings: {
          iconClass: 'icon-domain',
        },
      },
      {
        route: ['accounts/:accountId'],
        name: 'account',
        moduleId: 'researcher/account/account',
        nav: false,
        title: 'Projects',
        settings: {
          class: 'icon-home',
          breadIcon: 'icon-domain',
        },
      },
    ]);

    configureUnknownRoutes(config);
    this.router = router;
  }
}
