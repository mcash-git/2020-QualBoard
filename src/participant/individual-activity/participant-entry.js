import { computedFrom, observable, bindable, bindingMode } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { enums } from '2020-qb4';
import { ViewState } from 'shared/app-state/view-state';

const CompletionStatuses = enums.completionStatuses;

export class ParticipantEntry {
  static inject = [ViewState, EventAggregator];

  constructor(viewState, ea) {
    this.viewState = viewState;
    this.ea = ea;
  }

  @bindable({ defaultBindingMode: bindingMode.oneWay }) state;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) followupId;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) backUrl;
  @observable status;

  bind() {
    this.commentRespondingSubscription = this.ea.subscribe('comment-responding', payload => {
      const { parentResponse, parentResponseElement } = payload;
      this.responseDrawer.open({
        parentResponseModel: parentResponse,
        parentResponseElement,
        canProbe: false,
      });
    });
    this.stateChanged(this.state);
  }

  unbind() {
    if (this.commentRespondingSubscription) {
      this.commentRespondingSubscription.dispose();
    }
  }

  attached() {
    if (this.followupId) {
      const followupElement = document.getElementById(this.followupId);

      if (followupElement) {
        this.viewState.scrollIntoView(followupElement);

        this.ea.publish('comment-responding', {
          parentResponse: this.state.responseLookup.get(this.followupId),
          parentResponseElement: followupElement,
        });
      }
    }
  }

  stateChanged(state = null) {
    if (state === null) {
      return;
    }

    const {
      entry, individualActivity, projectUser, responseLookup, accountId,
    } = state;

    this.entryId = entry.id;
    this.completedTasks = entry.completedTasks;
    this.currentTask = entry.nextTask;
    this.moderatorId = individualActivity.defaultModeratorUserId;
    this.projectId = individualActivity.projectId;
    this.accountId = accountId;
    this.projectUser = projectUser;
    this.status = CompletionStatuses[entry.completionStatus.int];
    this.isLastTask = entry.isLastTask;
    this.responseLookup = responseLookup;
  }

  statusChanged(newStatus, oldStatus = null) {
    if (newStatus === CompletionStatuses.complete &&
      oldStatus !== newStatus &&
      oldStatus !== null) {
      setTimeout(() => {
        this.viewState.scrollIntoView(this.exitMsg);
      }, 100);
    }
  }

  @computedFrom('status')
  get isActive() {
    return this.status === CompletionStatuses.started;
  }

  @computedFrom('status')
  get isComplete() {
    return this.status === CompletionStatuses.complete;
  }
}
