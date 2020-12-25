import { Api } from 'api/api';
import { DomainState } from 'shared/app-state/domain-state';
import { OidcWrapper } from 'shared/auth/oidc-wrapper';
import { CurrentUserRole } from 'shared/current-user-role';
import { DialogService } from 'aurelia-dialog';
import { UserRouteAccess } from 'layout/user-route-access';
import { EventAggregator } from 'aurelia-event-aggregator';
import configureUnknownRoutes from 'shared/utility/configure-unknown-routes';

export class App {
  static inject = [
    Api,
    OidcWrapper,
    DialogService,
    CurrentUserRole,
    DomainState,
    UserRouteAccess,
    EventAggregator,
  ];

  constructor(api, auth, modalService, userRole, domainState, userRouteAccess, ea) {
    this.api = api;
    this.auth = auth;
    this.modalService = modalService;
    this.userRole = userRole;
    this.domainState = domainState;
    this.userRouteAccess = userRouteAccess;
    this.ea = ea;

    this.appVersion = window.VERSION;
    this.subscriptions = [];
  }


  async activate() {
    this.subscriptions = [
      this.ea.subscribe('openProfile', this.openProfileModal.bind(this)),
      this.ea.subscribe('logout', this.logout.bind(this)),
    ];

    if (this.userRole.isSuperUser()) {
      return;
    }

    const [modProjects, partProjects, obsProjects] = await Promise.all([
      this.api.query.projects.moderatorDashboard(),
      this.api.query.projects.participantDashboard(),
      this.api.query.projects.observerDashboard(),
    ]);

    this.domainState.participantProjects = partProjects;
    this.domainState.moderatorProjects = modProjects;
    this.domainState.observerProjects = obsProjects;
  }

  deactivate() {
    this.subsriptions.forEach(s => s.dispose());
  }


  logout() {
    this.auth.logoutRedirect();
  }

  openProfileModal() {
    this.modalService.open({
      viewModel: 'layout/profile-widget-modal',
    });
  }

  toggleNav() {
    this.siteWrapper.classList.toggle('show-nav');
  }

  configureRouter(config) {
    config.title = '20|20 Research';
    config.map([
      {
        route: ['', 'home'],
        name: 'home',
        moduleId: 'layout/home',
        nav: true,
        title: 'QualBoard',
      },
      {
        route: ['user/:userId'],
        name: 'users',
        moduleId: 'users/profile',
        nav: false,
        title: 'QualBoard',
      },
    ]);

    // build routes based on user roles
    this.userRouteAccess.buildUserRoutes();
    configureUnknownRoutes(config);
    config.fallbackRoute('home');
  }
}
