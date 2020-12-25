import { bindable, computedFrom } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Api } from 'api/api';
import { AppConfig } from 'app-config';
import { enums } from '2020-qb4';
import { eventKeys } from 'shared/events/event-keys';
import { DialogService } from 'aurelia-dialog';
import { DomainState } from 'shared/app-state/domain-state';
import { CurrentUser } from 'shared/current-user';
import get from 'lodash.get';
import moment from 'moment-timezone';
import { events } from '../insight-ea-events';

const PromptTypes = enums.promptTypes;
const ProjectRoles = enums.projectRoles;
const superUserWarning = 'Psst, hey super user!  You are not a moderator on this project!';
const activityClosedWarning = 'The event is closed.';

export class EntryTask {
  static inject = [
    Element,
    EventAggregator,
    Api,
    DialogService,
    DomainState,
    CurrentUser,
    AppConfig,
  ];

  constructor(element, ea, api, dialogService, domainState, user, appConfig) {
    this.element = element;
    this.ea = ea;
    this.api = api;
    this.modalService = dialogService;
    this.domainState = domainState;
    this.user = user;
    this.appConfig = appConfig;
  }

  @bindable task;
  @bindable projectUserLookup;
  @bindable insightBags;
  @bindable projectId;

  attached() {
    this.dragOver = 0;
  }

  detached() {
    if (this.responseSubscription) {
      this.responseSubscription.dispose();
    }
  }

  attachMedia() {
    this.mediaUploader.openFileDialog();
  }

  followUp() {
    if (!this.currentUserIsModerator || this.isResponding) {
      return;
    }

    this.isResponding = true;
    this.element.dispatchEvent(new CustomEvent('follow-up', {
      bubbles: true,
      detail: { response: this.task.response, element: this.responseBlockElement },
    }));
    this.drawerClosedSubscription = this.ea.subscribe('response-drawer-closed', () => {
      this.drawerClosedSubscription.dispose();
      this.isResponding = false;
    });
  }

  addResponseInsight() {
    this.ea.publish(events.tryAdd, { response: this.task.response });
  }

  _setUpResponseSubscription() {
    // TODO:  When going to real-timeyness, we will need to somehow pass the
    // project user ID into this view-model, since we need it to subscribe
    // and request the updated task responses.
    this.userId = this.task.response.userId;
    const eventKey = `${eventKeys.responseAdded}:${this.task.id}:${this.userId}`;
    this.responseSubscription = this.ea.subscribe(eventKey, async r => {
      setTimeout(() => this.loadUserTaskResponses(r.repetitionId), 300);
    });
  }

  async _loadUserTaskResponses(repetitionId) {
    const responses = await this.api.query.responses.getForUser({
      projectId: this.task.projectId,
      iaId: this.task.individualActivityId,
      userId: this.userId,
      taskId: this.task.id,
      repetitionId,
    });

    this.task.setResponses(
      responses,
      this.appConfig.media.baseUrl,
      this.appConfig.media.imageUriBase,
      this.userTimeZone,
      this.projectUserLookup,
    );
  }

  highlightInsights() {
    this.ea.publish(events.highlightByResponseId, { responseId: this.task.response.id });
  }

  @computedFrom('domainState.currentProjectUser.role')
  get currentUserIsModerator() {
    return get(this, 'domainState.currentProjectUser.role') === ProjectRoles.moderator.int;
  }

  @computedFrom('currentUser.isSuperUser')
  get currentUserIsSuperUser() {
    return this.user.isSuperUser;
  }

  @computedFrom(
    'domainState.individualActivity.openTime',
    'domainState.individualActivity.closeTime',
  )
  get isActivityOpen() {
    const now = moment();
    const open = moment(get(this, 'domainState.individualActivity.openTime'));
    const close = moment(get(this, 'domainState.individualActivity.closeTime'));
    return open < now && now < close;
  }

  @computedFrom('isActivityOpen', 'currentUserIsModerator', 'currentUserIsSuperUser')
  get disabledButtonTooltip() {
    if (!this.isActivityOpen) {
      return '';
    } else if (!this.currentUserIsModerator && this.currentUserIsSuperUser) {
      return '';
    }
    return null;
  }

  @computedFrom('isResponding')
  get responseBlockClass() {
    return this.isResponding ? 'is-responding-to' : '';
  }

  @computedFrom('task.type')
  get iconClass() {
    return this.task.type.icon;
  }

  @computedFrom('task.type')
  get viewModel() {
    const type = PromptTypes[this.task.type.int];
    let vmSegment;

    switch (type) {
      case PromptTypes.text:
        vmSegment = 'text';
        break;
      case PromptTypes.notice:
        vmSegment = 'notice';
        break;
      case PromptTypes.multipleChoice:
        vmSegment = 'multiple-choice';
        break;
      case PromptTypes.multipleAnswer:
        vmSegment = 'multiple-answer';
        break;
      case PromptTypes.matrixMultipleChoice:
        vmSegment = 'matrix-multiple-choice';
        break;
      case PromptTypes.matrixMultipleAnswer:
        vmSegment = 'matrix-multiple-answer';
        break;
      default:
        throw new Error('Unrecognized type:', this.task.type);
    }

    return `participant/components/task-responses/${vmSegment}/${vmSegment}-completed`;
  }

  @computedFrom('task.type')
  get taskClass() {
    return `event-item answered${this.task.type.value === 'Notice' ? ' notice' : ''}`;
  }

  @computedFrom('insightBags.length')
  get numFullResponseInsights() {
    return this.insightBags
      .filter(ic => ic.response && ic.response.id === this.task.response.id).length;
  }

  @computedFrom('currentUserIsModerator', 'currentUserIsSuperUser')
  get shouldButtonsShow() {
    return this.currentUserIsModerator || this.currentUserIsSuperUser;
  }

  @computedFrom('currentUserIsModerator', 'isActivityOpen')
  get isFollowupDisabled() {
    return !this.currentUserIsModerator || !this.isActivityOpen;
  }

  @computedFrom('currentUserIsModerator')
  get isAddInsightDisabled() {
    return !this.currentUserIsModerator;
  }

  @computedFrom('currentUserIsModerator', 'isActivityOpen')
  get followupButtonTooltip() {
    if (!this.currentUserIsModerator) {
      return superUserWarning;
    }
    if (!this.isActivityOpen) {
      return activityClosedWarning;
    }
    return null;
  }

  @computedFrom('currentUserIsModerator')
  get addInsightButtonTooltip() {
    return (!this.currentUserIsModerator) ?
      superUserWarning :
      null;
  }
}
