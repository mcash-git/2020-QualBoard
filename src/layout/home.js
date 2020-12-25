import { Router, RedirectToRoute } from 'aurelia-router';
import { CurrentUser } from 'shared/current-user';
import { DomainState } from 'shared/app-state/domain-state';

export class Home {
  static inject = [Router, DomainState, CurrentUser];

  constructor(router, domainState, user) {
    this.router = router;
    this.domainState = domainState;
    this.user = user;
  }

  async canActivate() {
    if (this.user.isSuperUser) {
      return new RedirectToRoute('super');
    }
    
    const pProj = this.domainState.participantProjects;
    const mProj = this.domainState.moderatorProjects;
    const oProj = this.domainState.observerProjects;
    const numRoles = [pProj, mProj, oProj].reduce((carry, e) => carry + (e && e.length > 0), 0);

    if (numRoles > 1) {
      // Has projects for at least two roles, user must choose which role to enter as
      return new RedirectToRoute('role-select');
    } else if (pProj && pProj.length > 0) {
      // Participant-only
      return new RedirectToRoute('participant');
    } else if (mProj && mProj.length > 0) {
      // Moderator-only
      return new RedirectToRoute('projects');
    } else if (oProj && oProj.length > 0) {
      // Observer-only
      return new RedirectToRoute('observer-projects');
    }

    // TODO::This should be a no access contact support page but for now
    return new RedirectToRoute('participant-dashboard');
  }
}
