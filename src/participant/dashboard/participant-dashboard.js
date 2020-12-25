import { Api } from 'api/api';
import { Router } from 'aurelia-router';
import { ViewState } from 'shared/app-state/view-state';
import { ParentViewState } from 'shared/app-state/parent-view-state';
import { CurrentUser } from 'shared/current-user';
import { ParticipantProjectCardModel } from './participant-project-card-model';

export class ParticipantDashboard {
  static inject = [Api, Router, ViewState, CurrentUser];

  constructor(api, router, viewState, currentUser) {
    this.api = api;
    this.router = router;
    this.viewState = viewState;
    this.user = currentUser;
  }

  async canActivate() {
    this.projects = await this.api.query.projects.participantDashboard();
    this.projectCards = this.projects
      .map(p => new ParticipantProjectCardModel(p, this.user));
    return true;
  }

  activate() {
    const state = new ParentViewState({
      title: 'My Projects',
      titleIcon: 'icon-home',
      shouldShowContentHeader: false,
      isParticipantRoute: true,
    });

    this.viewState.parentStateStack.push(state);
  }

  deactivate() {
    this.viewState.parentStateStack.pop();
  }
}
