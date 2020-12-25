import { bindable, bindingMode, computedFrom } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import moment from 'moment-timezone';
import { enums } from '2020-qb4';
import { Api } from 'api/api';
import { growlProvider } from 'shared/growl-provider';
import { CurrentUser } from 'shared/current-user';
import { humanizeMomentDuration } from 'shared/utility/humanize-moment-duration';

const RepeatUnits = enums.repeatUnits;
const CompletionStatuses = enums.completionStatuses;

const nouns = {
  2: 'Day',
  3: 'Week',
  4: 'Month',
};
const dateFormat = 'M/D/YYYY h:mm A (z)';

export class ParticipantProjectDashboardIndividualActivityCard {
  static inject = [
    Element,
    Router,
    Api,
    CurrentUser,
  ];

  constructor(element, router, api, user) {
    element.classList.add('card-tile-container');
    this.element = element;
    this.router = router;
    this.api = api;
    this.user = user;
  }

  @bindable({ defaultBindingMode: bindingMode.oneTime }) event;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) subscribeToEntryCreated;

  bind() {
    this.timePropIntervalId = setInterval(() => this.setTimeProps(), 1000);
    this.setTimeProps();
  }

  unbind() {
    if (this.timePropIntervalId) {
      clearInterval(this.timePropIntervalId);
    }
  }

  async handleStartClick() {
    if (!this.event.isOpen || this.event.isCurrentIntervalMaximumSatisfied) {
      return;
    }

    const activeRepStatus = CompletionStatuses[this.event.activeRepetitionStatus.int];

    if (activeRepStatus !== CompletionStatuses.started) {
      const response = await this.api.command.individualActivities
        .createRepetition({
          projectId: this.event.projectId,
          userId: this.event.userId,
          iaId: this.event.eventId,
        });
      if (response.id) {
        this.subscribeToEntryCreated(this.event.id, () => {
          location.href = `/#/participant/projects/${this.event.projectId}/users/${
            this.event.userId}/individual-activities/${this.event.eventId}`;
        });
      } else {
        growlProvider.warning('Error', 'There was an error attempting to load your activity.  Please try again');
      }
    } else {
      location.href = this.startUrl; // eslint-disable-line
    }
  }

  getRepeatingRequirementsText() {
    const repeatUnit = RepeatUnits[this.event.repeatUnit.int];
    const repeatNounLower = nouns[repeatUnit.int].toLowerCase();

    let text = `This activity repeats every ${repeatNounLower} until ${
      this.event.closesOn.tz(this.user.timeZone).format(dateFormat)}. Every ${
      repeatNounLower} you must complete it `;
    const minRepPlurality = this.event.minimumRepetitionCompletionCount === 1 ? '' : 's';

    if (this.event.minimumRepetitionCompletionCount ===
      this.event.maximumRepetitionCompletionCount) {
      text += `${this.event.minimumRepetitionCompletionCount} time${minRepPlurality} `;
    } else {
      text += `at least ${this.event.minimumRepetitionCompletionCount} time${minRepPlurality
      }, and you can complete it `;

      if (this.event.maximumRepetitionCompletionCount) {
        text += `a maximum of ${this.event.maximumRepetitionCompletionCount} times `;
      } else {
        text += 'as many times as you want ';
      }
    }

    text += `per ${repeatNounLower}.`;

    return text;
  }

  humanizeDuration(duration) {
    return duration.asMilliseconds() <= 1000 ?
      'please wait...' :
      humanizeMomentDuration(duration);
  }

  setTimeProps() {
    const now = moment();
    const nextAvailable = moment(this.event.nextIntervalAvailableOn);
    this.nextIntervalStartTimeText =
      this.humanizeDuration(moment.duration(nextAvailable.diff(now)));
    this.openDateText = this.humanizeDuration(moment.duration(this.event.opensOn.diff(now)));
    this.shouldShowPendingIntervalText = this.event.isOpen &&
      this.event.isCurrentIntervalMaximumSatisfied &&
      (
        this.event.nextIntervalAvailableOn !== null &&
        this.event.nextIntervalAvailableOn.isValid() &&
        this.event.nextIntervalAvailableOn.isAfter(now)
      );

    this.dueText = this.event.currentIntervalClosesOn.isAfter(now) ?
      `Due: ${this.event.currentIntervalClosesOn.tz(this.user.timeZone).format(dateFormat)}` :
      'This activity is closed.';
  }

  @computedFrom(
    'event.projectId',
    'event.userId',
    'event.eventId',
    'event.oldestProbeRepetitionId',
    'event.oldestProbeId',
  )
  get nextFollowupUrl() {
    return `/#/participant/projects/${this.event.projectId}/users/${this.event.userId
    }/individual-activities/${this.event.eventId}/${this.event.oldestProbeRepetitionId}/${
      this.event.oldestProbeId}`;
  }

  @computedFrom(
    'event.projectId',
    'event.userId',
    'event.eventId',
    'event.lastCompletedRepetitionId',
  )
  get historyUrl() {
    return `/#/participant/projects/${this.event.projectId}/users/${this.event.userId
    }/individual-activities/${this.event.eventId}/${this.event.lastCompletedRepetitionId}`;
  }

  @computedFrom('event.repeatUnit')
  get isRepeating() {
    const repeatUnit = RepeatUnits[this.event.repeatUnit.int];
    return repeatUnit === RepeatUnits.daily ||
      repeatUnit === RepeatUnits.weekly ||
      repeatUnit === RepeatUnits.monthly;
  }

  @computedFrom(
    'event.isClosed',
    'event.activeRepetitionHasReceivedResponse',
    'event.activeRepetitionStatus',
    'event.isCurrentIntervalMinimumSatisfied',
  )
  get actionButtonText() {
    if (this.event.isClosed) {
      return 'Closed';
    }

    const completionStatus = CompletionStatuses[this.event.activeRepetitionStatus.int];

    // It is possible for an event's active entry to be in the Started state, yet not have received
    // a response.  In this case, the user has hit the create-entry endpoint but NOT submitted a
    // single response - but they have clicked "Start" on the event card.
    if (this.event.activeRepetitionHasReceivedResponse &&
      completionStatus === CompletionStatuses.started) {
      return 'Continue';
    }

    if (this.event.isCurrentIntervalMinimumSatisfied) {
      return 'Do Again';
    }

    return 'Start Activity';
  }

  @computedFrom(
    'event.activeRepetitionId',
    'event.projectId',
    'event.eventId',
    'event.userId',
  )
  get startUrl() {
    return `/#/participant/projects/${this.event.projectId}/users/${this.event.userId
    }/individual-activities/${this.event.eventId}/${this.event.activeRepetitionId || ''}`;
  }

  @computedFrom(
    'event.repeatUnit',
    'event.minimumRepetitionCompletionCount',
    'event.maximumRepetitionCompletionCount',
  )
  get requirementsText() {
    const repeatUnit = RepeatUnits[this.event.repeatUnit.int];
    const minAndMaxAreEqualAndContinuous =
      repeatUnit === RepeatUnits.continuous &&
      this.event.minimumRepetitionCompletionCount === this.event.maximumRepetitionCompletionCount;

    const minAndMaxIsOneAndNoRepeatOrContinuous =
      repeatUnit === RepeatUnits.none ||
      (minAndMaxAreEqualAndContinuous && this.event.minimumRepetitionCompletionCount === 1);

    const maximumUndefinedAndContinuous =
      repeatUnit === RepeatUnits.continuous && this.event.maximumRepetitionCompletionCount === null;

    if (minAndMaxIsOneAndNoRepeatOrContinuous) {
      return 'You must complete this activity one time.';
    } else if (minAndMaxAreEqualAndContinuous) {
      return `You must complete this activity ${
        this.event.minimumRepetitionCompletionCount} times.`;
    } else if (maximumUndefinedAndContinuous) {
      return `You must complete this activity at least ${
        this.event.minimumRepetitionCompletionCount
      } times, and you can complete it as many times as you want.`;
    } else if (repeatUnit === RepeatUnits.continuous) {
      return `You must complete this activity at least ${
        this.event.minimumRepetitionCompletionCount
      } times, and you can complete it a maximum of ${
        this.event.maximumRepetitionCompletionCount} times.`;
    }

    return this.getRepeatingRequirementsText();
  }

  @computedFrom('event.isOpen', 'event.isCurrentIntervalMaximumSatisfied')
  get shouldShowActionButton() {
    return this.event.isOpen && !this.event.isCurrentIntervalMaximumSatisfied;
  }

  @computedFrom(
    'event.isTotallyCompleted',
    'event.isCurrentIntervalMaximumSatisfied',
  )
  get shouldShowActivityCompleteText() {
    return this.event.isTotallyCompleted && this.event.isCurrentIntervalMaximumSatisfied;
  }

  @computedFrom(
    'event.closesOn',
    'user.timeZone',
  )
  get closedDateText() {
    return this.event.closesOn.tz(this.user.timeZone).format(dateFormat);
  }

  @computedFrom(
    'event.totalRepetitionCompletionCount',
    'event.isClosed',
  )
  get isHistoryButtonEnabled() {
    return this.event.totalRepetitionCompletionCount > 0 && !this.event.isClosed;
  }

  @computedFrom(
    'event.probeCount',
    'event.isClosed',
  )
  get isFollowupButtonEnabled() {
    return this.event.probeCount > 0 && !this.event.isClosed;
  }
}
