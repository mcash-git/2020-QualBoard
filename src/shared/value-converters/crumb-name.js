import { DomainState } from 'shared/app-state/domain-state';
import { Router } from 'aurelia-router';

export class CrumbNameValueConverter {
  static inject = [Router, DomainState];

  constructor(router, applicationState) {
    this.router = router;
    this.domainState = applicationState;
  }

  fetchName(value) {
    value = value.toLowerCase();
    let name = '';
    switch (value) {
      case 'account':
        name = this.accountName();
        break;
      case 'project':
        name = this.projectName();
        break;
      case 'participant-project':
      case 'participant-single':
        name = this.projectPublicName();
        break;
      case 'activity':
        name = this.activityName();
        break;
      case 'participant-individual-activity':
        name = this.publicActivityName();
        break;
      default:
        break;
    }
    return name;
  }

  accountName() {
    return this.domainState.account.name;
  }

  projectName() {
    return this.domainState.project.privateName;
  }

  projectPublicName() {
    return this.domainState.project.name;
  }

  activityName() {
    return this.domainState.individualActivity.privateName;
  }

  publicActivityName() {
    return this.domainState.header.subtitle;
  }

  toView(routeName) {
    if (routeName) {
      return this.fetchName(routeName);
    }
    return '';
  }
}
