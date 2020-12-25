import { Router } from 'aurelia-router';
import { CurrentUserRole } from 'shared/current-user-role';


export class UserRouteAccess {
  static inject = [Router, CurrentUserRole];

  constructor(router, currentUserRole, domainState) {
    this.router = router;
    this.userRole = currentUserRole;
    this.domainState = domainState;
  }

  buildUserRoutes() {
    if (this.userRole.isSuperUser()) {
      this.addSuperRoute();
    }

    if (this.userRole.isAccountAdmin()) {
      this.addAccntsRoute();
    }

    if (this.userRole.isModerator()) {
      this.addModRoute();
    }

    if (this.userRole.isObserver()) {
      this.addObsRoute();
    }

    if (this.userRole.isParticipant()) {
      this.addParticipantRoute();
    }

    if (this.userRole.hasMultipleRoles()) {
      this.addRoleSelectRoute();
    }
  }

  addSuperRoute() {
    this.router.addRoute({
      route: 'super',
      name: 'super',
      moduleId: 'researcher/super/super',
      nav: true,
      title: 'QualBoard',
    });
    this.addAccntsRoute();
    this.addModRoute();
    this.addObsRoute();
    this.addParticipantRoute();
    this.addRoleSelectRoute();
  }

  addAccntsRoute() {
    this.router.addRoute({
      route: 'accounts',
      name: 'accounts',
      moduleId: 'researcher/account/accounts',
      nav: false,
      title: 'QualBoard',
      settings: {
      },
    });
  }

  addModRoute() {
    this.router.addRoute({
      route: 'projects',
      name: 'projects',
      moduleId: 'researcher/project/projects',
      nav: false,
      title: 'QualBoard',
      settings: {
      },
    });
  }

  addObsRoute() {
    this.router.addRoute({
      route: 'observer',
      name: 'observer-projects',
      moduleId: 'observer/project/projects',
      nav: false,
      title: 'QualBoard',
      settings: {
      },
    });
  }

  addParticipantRoute() {
    this.router.addRoute({
      route: 'participant',
      name: 'participant',
      moduleId: 'participant/participant',
      nav: false,
      title: 'QualBoard',
    });
  }

  addRoleSelectRoute() {
    this.router.addRoute({
      route: 'role-select',
      name: 'role-select',
      moduleId: 'layout/role-select',
      nav: false,
      title: 'QualBoard',
    });
  }
}
