import { DomainState } from 'shared/app-state/domain-state';

export class AccountSettings {
  static inject = [DomainState];

  constructor(domainState) {
    this.domainState = domainState;
  }
  
  editing;

  async activate() {
    this.account = this.domainState.account;
  }
}
