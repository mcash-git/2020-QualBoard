import { DialogService } from 'aurelia-dialog';
import { DomainState } from 'shared/app-state/domain-state';
import { ChildViewState } from 'shared/app-state/child-view-state';
import { ViewState } from 'shared/app-state/view-state';

import { Api } from 'api/api';
import configureUnknownRoutes from 'shared/utility/configure-unknown-routes';

export class Analytics {
  static inject() { return [Api, DomainState, DialogService, ViewState]; }

  constructor(api, domainState, modalService, viewState) {
    this.api = api;
    this.domainState = domainState;
    this.modalService = modalService;
    this.viewState = viewState;
  }

  async canActivate(params) {
    this.accountId = params.accountId;
    this.projectId = params.projectId;
    this.iaId = params.iaId;

    // this.individualActivity = await this.api.query.individualActivities.get(
    //   this.projectId, this.iaId);

    // this.individualActivity.accountId = this.accountId;
  }

  async activate() {
    // this.domainState.header.subtitle = this.individualActivity.privateName;
    // // this.domainState.individualActivity = this.individualActivity;

    // if (!this.domainState.project.events) {
    //   this.events = await this.api.query.projects.events(this.projectId);
    //   this.domainState.project.events = this.events;
    // }

    this.viewState.childStateStack.push(new ChildViewState({
      fullHeight: true,
    }));
  }

  deactivate() {
    this.domainState.header.subtitle = null;
    this.viewState.childStateStack.pop();
  }

  attached() {
    window.dispatchEvent(new Event('resize'));
  }

  closeClick() {
    let { router } = this;
    while (!router.isRoot) {
      router = router.parent;
    }
    router.navigate(`accounts/${this.accountId}/projects/${this.projectId}`);
  }

  configureRouter(config, router) {
    config.map([
      {
        route: ['', 'create'],
        name: 'create-analytics',
        moduleId: './analytics/create-analytics',
        nav: true,
        title: 'Create',
        settings: {
          class: 'icon-noun_640064',
        },
      },
      {
        route: ['explore/:jobId'],
        name: 'explore-analytics',
        moduleId: './analytics/explore-analytics',
        nav: false,
        title: 'Explore',
        settings: {
          class: 'icon-person',
        },
      },
    ]);

    configureUnknownRoutes(config);
    this.router = router;
  }
}
