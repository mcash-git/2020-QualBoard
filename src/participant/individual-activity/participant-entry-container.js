import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { computedFrom } from 'aurelia-framework';
import { Api } from 'api/api';
import { ViewState } from 'shared/app-state/view-state';
import { participantStore } from 'participant/state/participant-store';
import { fetchStatuses } from 'shared/enums/fetch-statuses';
import { receiveEntry, receiveIndividualActivity, releaseEntry } from 'participant/state/actions/all';
import { getCurrentUserState } from 'participant/state/selectors/get-current-user-state';
import { getIndividualActivityState } from 'participant/state/selectors/get-individual-activity-state';
import { getEntryState } from 'participant/state/selectors/get-entry-state';
import { ParentViewState } from 'shared/app-state/parent-view-state';
import { ChildViewState } from 'shared/app-state/child-view-state';
import get from 'lodash.get';
import { getProjectUsersState } from '../state/selectors/get-project-users-state';
import { getProjectState } from '../state/selectors/get-project-state';

const nextTaskTimeoutMs = 2000;

export class ParticipantEntryContainer {
  static inject = [Api, ViewState, Router, EventAggregator];

  constructor(api, viewState, router, ea) {
    this.api = api;
    this.viewState = viewState;
    this.router = router;
    this.ea = ea;
  }

  async activate(params) {
    this.routeParams = params;
    const {
      projectId,
      iaId,
      userId,
      entryId = null,
      followupId = null,
    } = params;

    this.projectId = projectId;
    this.iaId = iaId;
    this.userId = userId;
    this.entryId = entryId;
    this.followupId = followupId;

    const handleStateChange = () => {
      this._setRelevantState(participantStore.getState());
      this._setTitle();
    };

    this.unsubscribeFromStore = participantStore.subscribe(handleStateChange);
    await this._fetchEverything();
    this._initializeViewState();
  }

  deactivate() {
    this.viewState.childStateStack.pop();
    this.viewState.parentStateStack.pop();
  }

  unbind() {
    if (this.unsubscribeFromStore) {
      this.unsubscribeFromStore();
    }
    if (this.nextTaskTimeoutId) {
      clearTimeout(this.nextTaskTimeoutId);
      this.nextTaskTimeoutId = null;
    }
    participantStore.dispatch(releaseEntry());
  }

  navigateToEntry(entryId, followupId) {
    this.router.navigateToRoute('participant-entry', {
      iaId: this.iaId,
      entryId,
      followupId,
    });
  }

  goToNextFollowup() {
    const nextFollowup = this.state.individualActivity.requiredFollowups[0];
    if (nextFollowup === undefined) {
      return;
    }
    if (nextFollowup.entryId !== this.entryId) {
      this.navigateToEntry(nextFollowup.entryId, nextFollowup.id);
    } else {
      this.openResponseDrawerAndScrollToFollowup(nextFollowup.id);
    }
  }

  openResponseDrawerAndScrollToFollowup(followupId) {
    const followupElement = document.getElementById(followupId);

    if (followupElement) {
      this.viewState.scrollIntoView(followupElement);

      this.ea.publish('comment-responding', {
        parentResponse: this.state.responseLookup.get(followupId),
        parentResponseElement: followupElement,
      });
    }
  }

  async _fetchEverything() {
    this.status = fetchStatuses.pending;

    try {
      await this._fetchIndividualActivity();
      this.status = fetchStatuses.success;
    } catch (error) {
      this.status = fetchStatuses.failure;
    }
  }

  _initializeViewState() {
    this.upUrl = getUpUrl(this.router.history.fragment);
    this.viewState.parentStateStack.push(new ParentViewState({
      backButtonRoute: this.upUrl,
      title: this.iaName,
      titleIcon: 'icon-noun_640064',
      shouldShowContentHeader: false,
      isParticipantRoute: true,
    }));
    this.viewState.childStateStack.push(new ChildViewState({
      actionBarViewModel: 'participant/individual-activity/participant-entry-action-bar',
      actionBarModel: this,
    }));
    this.isInitialized = true;
  }

  _setTitle() {
    // only modify view-state if we have pushed it
    if (!this.isInitialized) {
      return;
    }
    this.viewState.parentStateStack.current.title = this.iaName;
  }

  async _fetchIndividualActivity() {
    const [ia, entry] = await Promise.all([
      this.api.query.individualActivities
        .getParticipantOverview(this.projectId, this.iaId, this.entryId),
      this.api.query.individualActivities
        .getParticipantEntry(this.projectId, this.iaId, this.entryId),
    ]);

    ia.projectId = this.projectId;

    participantStore.dispatch(receiveEntry(entry.id, entry));
    participantStore
      .dispatch(receiveIndividualActivity(ia.id, ia));
  }

  _setRelevantState(allState) {
    const projectUserState = getProjectUsersState(allState);
    const currentUserId = getCurrentUserState(allState).user.userId;
    const projectState = getProjectState(allState);

    this.state = {
      individualActivity: getIndividualActivityState(allState).individualActivity,
      entry: getEntryState(allState).entry,
      projectUser: projectUserState.lookupById.get(currentUserId),
      accountId: projectState.accountId,
    };

    if (this.shouldSetTimeout) {
      this.nextTaskTimeoutId = setTimeout(() => {
        if (!this) {
          return;
        }
        this._fetchEverything();
      }, nextTaskTimeoutMs);
    } else if (this.shouldClearTimeout) {
      clearTimeout(this.nextTaskTimeoutId);
      this.nextTaskTimeoutId = null;
    }

    if (this.state.entry) {
      this.state.responseLookup = this.state.entry.completedTasks.reduce((lookup, task) => {
        task.allResponses.forEach(r => lookup.set(r.id, r));
        return lookup;
      }, new Map());
    }
  }

  @computedFrom('state')
  get iaName() {
    return get(this, 'state.individualActivity.name');
  }

  get shouldSetTimeout() {
    return this.state.entry &&
      this.state.entry.nextTask === null &&
      this.state.entry.completionStatus.value === 'Started' &&
      !this.nextTaskTimeoutId;
  }

  get shouldClearTimeout() {
    return this.state.entry &&
      (this.state.entry.nextTask !== null ||
      this.state.entry.completionStatus.value !== 'Started') &&
      this.nextTaskTimeoutId;
  }
}

const eventDashRegex = /.+\/users\/[^/]+\//i;
function getUpUrl(currentFragment) {
  const match = eventDashRegex.exec(currentFragment);
  if (match === null) {
    throw new Error('Unable to determine [up/back] URL - REGEX did not match.');
  }

  return `/#${match[0]}dashboard`;
}
