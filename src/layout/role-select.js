import { DomainState } from 'shared/app-state/domain-state';
import { Api } from 'api/api';

export class RoleSelect {
  static inject = [DomainState, Api];
  constructor(domainState, api) {
    this.domainState = domainState;
    this.api = api;
  }

  async canActivate() {
    if (!this.domainState.participantProjects ||
      !this.domainState.moderatorProjects) {
      const [pProj, mProj, oProj] = await Promise.all([
        this.api.query.projects.participantDashboard(),
        this.api.query.projects.moderatorDashboard(),
        this.api.query.projects.observerDashboard(),
      ]);
      this.domainState.participantProjects = pProj;
      this.domainState.moderatorProjects = mProj;
      this.domainState.observerProjects = oProj;
    }
    this.partProjectCount = this.domainState.participantProjects.length;
    this.modProjectCount = this.domainState.moderatorProjects.length;
    this.obsProjectCount = this.domainState.observerProjects.length;
  }
}
