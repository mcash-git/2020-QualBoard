import { Router } from 'aurelia-router';
import { DomainState } from 'shared/app-state/domain-state';
import { ViewState } from 'shared/app-state/view-state';
import { EventAggregator } from 'aurelia-event-aggregator';
import { CurrentUser } from 'shared/current-user';
import { bindable, bindingMode } from 'aurelia-framework';

export class Bread {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) size;

  static inject = [Router, DomainState, ViewState, EventAggregator, CurrentUser];

  constructor(router, domainState, viewState, eventAggregator, currentUser) {
    this.router = router;
    this.domainState = domainState;
    this.viewState = viewState;
    this.ea = eventAggregator;
    this.currentUser = currentUser;

    this.projects = [];
    this.events = [];
    this.showDash = true;
  }

  attached() {
    this.viewModel = `layout/breadcrumb/breadcrumb-${this.size}`;
    this.routes = this.router.currentInstruction.getAllInstructions();
    this.subscription = this.ea.subscribe(
      'router:navigation:success',
      ::this.navigationSuccess,
    );

    if (this.currentUser.isDeveloper || this.currentUser.isSuperUser) {
      return true;
    }
    return true;
  }

  buildEvents() {
    if (this.domainState.project
      && this.domainState.project.events
      && this.domainState.project.events.length > 1) {
      this.events = this.domainState.project.events
        .filter(e => this.domainState.individualActivity
        && this.domainState.individualActivity.id !== e.id);
    }
  }

  buildProjects() {
    if (this.domainState.moderatorProjects && this.domainState.moderatorProjects.length > 1) {
      this.projects = this.domainState.moderatorProjects
        .filter(this.checkProjectNotMatch.bind(this));
    }

    if (this.domainState.participantProjects && this.domainState.participantProjects.length > 1) {
      this.projects = this.domainState.participantProjects
        .filter(this.checkProjectNotMatch.bind(this));
    }
  }

  checkProjectNotMatch(p) {
    if (this.domainState.project && p.id !== this.domainState.project.id) {
      return p;
    }
    return false;
  }

  checkToShowDash() {
    if (this.domainState.participantProjects && this.domainState.participantProjects.length === 1) {
      this.showDash = false;
    }
  }

  navigationSuccess() {
    this.routes = this.router.currentInstruction.getAllInstructions();
    this.projects = [];
    this.events = [];
    this.buildProjects();
    this.buildEvents();
    this.checkToShowDash();
  }

  navigate(navigationInstruction, name, params) {
    if (name && params) {
      navigationInstruction.router.navigateToRoute(name, params);
      return;
    }
    navigationInstruction.router
      .navigateToRoute(navigationInstruction.config.name, navigationInstruction.params);
  }

  detached() {
    this.subscription.dispose();
  }
}
