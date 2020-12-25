import { activationStrategy } from 'aurelia-router';
import { Api } from 'api/api';
import { ViewState } from 'shared/app-state/view-state';
import { ParentViewState } from 'shared/app-state/parent-view-state';
import { receiveProjectUsers, receiveProject } from 'participant/state/actions/all';
import { participantStore } from 'participant/state/participant-store';
import configureUnknownRoutes from 'shared/utility/configure-unknown-routes';
import { CurrentUser } from 'shared/current-user';

export class ParticipantProject {
  static inject = [Api, ViewState, CurrentUser];

  constructor(api, viewState, currentUser) {
    this.api = api;
    this.viewState = viewState;
    this.currentUser = currentUser;
  }

  async canActivate({ projectId, userId }) {
    this.projectId = projectId;
    this.userId = userId;

    return (userId === this.currentUser.userId);
  }

  async activate() {
    this.parentViewState = new ParentViewState({
      titleIcon: 'icon-folder',
      shouldShowContentHeader: false,
      isParticipantRoute: true,
    });
    this.viewState.parentStateStack.push(this.parentViewState);

    const handleStateChange = () => {
      const state = participantStore.getState();
      this.parentViewState.title = state.project && state.project.name;
    };

    this.unsubscribeFromStore = participantStore.subscribe(handleStateChange);

    await this._fetchUsers();
  }

  unbind() {
    this.viewState.parentStateStack.pop();
    if (this.unsubscribeFromStore) {
      this.unsubscribeFromStore();
    }
  }

  configureRouter(config) {
    config.map([
      {
        route: ['dashboard'],
        name: 'participant-project-dashboard',
        moduleId: 'participant/project/dashboard/participant-project-dashboard',
        nav: false,
        title: 'QualBoard',
      },
      {
        route: ['individual-activities/:iaId/:entryId?/:followupId?'],
        name: 'participant-entry',
        moduleId: 'participant/individual-activity/participant-entry-container',
        nav: false,
        title: '',
        settings: {
          breadIcon: 'icon-noun_640064',
        },
        activationStrategy: activationStrategy.replace,
      },
    ]);

    configureUnknownRoutes(config);
  }

  // New state-management, load project users early.
  async _fetchUsers(delay) {
    try {
      const [project, users] = await Promise.all([
        this.api.query.projects.getParticipantOverview(this.projectId),
        this.api.query.projectUsers.getProjectUsers(this.projectId),
      ]);
      participantStore.dispatch(receiveProjectUsers(this.projectId, users));
      participantStore.dispatch(receiveProject(project));
    } catch (error) {
      // ¯\_(ツ)_/¯
      const delayMs = (delay || 0) + 1000;
      setTimeout(() => this._fetchUsers(delayMs), delayMs);
    }
  }
}
