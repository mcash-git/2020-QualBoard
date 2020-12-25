import { CurrentUser } from 'shared/current-user';
import { DomainState } from 'shared/app-state/domain-state';

export class CurrentUserRole {
  static inject = [CurrentUser, DomainState];

  constructor(currentUser, domainState) {
    this.user = currentUser;
    this.domainState = domainState;

    this.role = [
      { int: 0, value: 'su', friendly: 'super-user' },
      { int: 1, value: 'accnt', friendly: 'account-admin' },
      { int: 2, value: 'mod', friendly: 'moderator' },
      { int: 3, value: 'part', friendly: 'participant' },
    ];
  }

  checkRoles() {
    if (this.isSuperUser) {
      return this.role[0];
    }

    const roles = [];
    if (this.isAccountAdmin()) {
      roles.push(this.role[1]);
    }
    if (this.isModerator()) {
      roles.push(this.role[2]);
    }
    if (this.isParticipant()) {
      roles.push(this.role[3]);
    }

    return roles;
  }

  isSuperUser() {
    return this.user.isSuperUser;
  }

  isAccountAdmin() {
    return false;
  }

  isModerator() {
    const modProjects = this.domainState.moderatorProjects;
    return modProjects && modProjects.length > 0;
  }

  isObserver() {
    const obsProjects = this.domainState.observerProjects;
    return obsProjects && obsProjects.length > 0;
  }

  isParticipant() {
    const partProjects = this.domainState.participantProjects;
    return partProjects && partProjects.length > 0;
  }

  hasMultipleRoles() {
    return (this.isModerator() + this.isObserver() + this.isParticipant()) > 1;
  }
}
