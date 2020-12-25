import { Router } from 'aurelia-router';
import { DomainState } from 'shared/app-state/domain-state';
import { ViewState } from 'shared/app-state/view-state';
import { ParentViewState } from 'shared/app-state/parent-view-state';
import { Api } from 'api/api';
import { actions } from 'researcher/state/all-actions';
import configureUnknownRoutes from 'shared/utility/configure-unknown-routes';

export class Account {
  static inject = [Api, Router, DomainState, ViewState, 'store'];

  constructor(api, router, domainState, viewState, store) {
    this.api = api;
    this.router = router;
    this.domainState = domainState;
    this.viewState = viewState;
    this.store = store;
  }

  // pre-load stuff, anything we need to grab from api
  async canActivate(params) {
    this.account = await this.api.query.accounts.overview(params.accountId);
    // researcherStore.dispatch(receiveAccount(this.account));
    this.store.dispatch(actions.account.set(this.account));
    return true;
  }

  activate() {
    // TODO:  We may need to handle switching from one account to another, I am
    // not positive that `deactivate` is called when that happens.
    this.domainState.account = this.account;
    this.viewState.parentStateStack.push(new ParentViewState({
      title: this.account.name,
      titleIcon: 'icon-domain',
      navItems: this.router.navigation,
      backButtonRoute: getUpUrl(this.router.history.fragment),
      isResearcherRoute: true,
      statItems: [{
        iconClass: 'icon-folder',
        title: 'Active Projects:',
        value: this.account.activeProjectCount,
      }],
    }));

    this.domainState.header.title = this.account.name;
    this.domainState.header.subNavItems = this.router.navigation;
  }

  deactivate() {
    this.viewState.parentStateStack.pop();
  }

  configureRouter(config, router) {
    config.map([
      {
        route: ['', 'projects'],
        name: 'projects',
        moduleId: './projects/projects',
        nav: true,
        title: 'Projects',
        settings: {
          iconClass: 'icon-folder',
        },
      },
      {
        route: ['settings'],
        name: 'account-settings',
        moduleId: './settings/account-settings',
        nav: true,
        title: 'Account Settings',
        settings: {
          breadIcon: 'icon-settings',
          breadName: 'Settings',
          iconClass: 'icon-settings',
          hideMini: true,
        },
      },
      {
        route: ['projects/:projectId'],
        name: 'project',
        moduleId: 'researcher/project/project',
        nav: false,
        title: 'Project',
        settings: {
          breadIcon: 'icon-folder',
        },
      },
    ]);

    configureUnknownRoutes(config);
    this.router = router;
  }
}

const accountsUrlRegex = /.+accounts/i;
function getUpUrl(currentFragment) {
  const match = accountsUrlRegex.exec(currentFragment);
  if (match === null) {
    throw new Error('Unable to determine [up/back] URL - REGEX did not match.');
  }

  return `/#${match[0]}`;
}
