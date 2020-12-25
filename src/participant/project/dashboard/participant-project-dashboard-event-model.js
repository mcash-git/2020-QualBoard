import { computedFrom } from 'aurelia-framework';
import { enums } from '2020-qb4';
import moment from 'moment-timezone';
import { ParticipantFollowupOverviewModel } from 'participant/models/participant-followup-overview-model';

const RepeatUnits = enums.repeatUnits;
const EventTypes = enums.eventTypes;
const CompletionStatuses = enums.completionStatuses;

export class ParticipantProjectDashboardEventModel {
  constructor({
    id = null, // This field is '<eventId><userId>'
    userId = null,
    projectId = null,
    eventId = null,
    isActive = false,
    eventType = EventTypes.individualActivity,
    name = null,
    incentiveAmount = null,
    opensOn = moment(null),
    closesOn = moment(null),
    timeZone = null,
    completedOn = moment(null),
    repeatUnit = RepeatUnits.none,
    firstParticipantResponseOn = moment(null),
    lastParticipantResponseOn = moment(null),
    minimumRepetitionCompletionCount = null,
    maximumRepetitionCompletionCount = null,
    totalIntervalCount = null,
    totalIntervalCompletionCount = null,
    missedIntervalCount = null,
    intervalRepetitionCompletionCount = null,
    activeIntervalCompletedOn = moment(null),
    totalRepetitionCompletionCount = null,
    lastCompletedRepetitionId = null,
    activeRepetitionId = null,
    activeRepetitionClosesOn = moment(null),
    activeRepetitionHasReceivedResponse = null,
    activeRepetitionStatus = CompletionStatuses.created,
    nextIntervalAvailableOn = moment(null),
    probeCount = null,
    probes = [],
    oldestProbeId = null,
    oldestProbeRepetitionId = null,
    repetitionIds = [],
  } = {}) {
    this.id = id;
    this.userId = userId;
    this.projectId = projectId;
    this.eventId = eventId;
    this.isActive = isActive;
    this.eventType = eventType;
    this.name = name;
    this.incentiveAmount = incentiveAmount;
    this.opensOn = opensOn;
    this.closesOn = closesOn;
    this.timeZone = timeZone;
    this.completedOn = completedOn;
    this.repeatUnit = repeatUnit;
    this.firstParticipantResponseOn = firstParticipantResponseOn;
    this.lastParticipantResponseOn = lastParticipantResponseOn;
    this.minimumRepetitionCompletionCount = minimumRepetitionCompletionCount;
    this.maximumRepetitionCompletionCount = this.repeatUnit.value === 'None' ?
      1 :
      maximumRepetitionCompletionCount;
    this.totalIntervalCount = totalIntervalCount;
    this.totalIntervalCompletionCount = totalIntervalCompletionCount;
    this.missedIntervalCount = missedIntervalCount;
    this.intervalRepetitionCompletionCount = intervalRepetitionCompletionCount;
    this.activeIntervalCompletedOn = activeIntervalCompletedOn;
    this.totalRepetitionCompletionCount = totalRepetitionCompletionCount;
    this.lastCompletedRepetitionId = lastCompletedRepetitionId;
    this.activeRepetitionId = activeRepetitionId;
    this.activeRepetitionClosesOn = activeRepetitionClosesOn;
    this.activeRepetitionHasReceivedResponse = activeRepetitionHasReceivedResponse;
    this.activeRepetitionStatus = activeRepetitionStatus;
    this.nextIntervalAvailableOn = nextIntervalAvailableOn;
    this.probeCount = probeCount;
    this.probes = [...probes]
      .sort((a, b) => a.responseTimeStamp.localeCompare(b.responseTimeStamp));
    this.oldestProbeId = oldestProbeId;
    this.oldestProbeRepetitionId = oldestProbeRepetitionId;
    this.repetitionIds = repetitionIds;

    this.setTimeBasedFields();
  }

  static fromDto({
    id = null,
    userId = null,
    projectId = null,
    eventId = null,
    isActive = true,
    eventType = 0,
    eventName = null,
    eventIncentiveAmount = 0.0,
    eventOpensOn = null,
    eventClosesOn = null,
    eventTimeZone = null,
    eventCompletedOn = null,
    repeatUnit = 0,
    firstParticipantResponseOn = null,
    lastParticipantResponseOn = null,
    minimumRepetitionCompletionCount = 1,
    maximumRepetitionCompletionCount = null,
    totalIntervalCount = 1,
    totalIntervalCompletionCount = null,
    missedIntervalCount = 0,
    intervalRepetitionCompletionCount = 0,
    activeIntervalCompletedOn = null,
    totalRepetitionCompletionCount = 0,
    lastCompletedRepetitionId = null,
    activeRepetitionId = null,
    activeRepetitionClosesOn = null,
    activeRepetitionHasReceivedResponse = true,
    activeRepetitionStatus = 0,
    nextIntervalAvailableOn = null,
    probeCount = null,
    probes = [],
    oldestProbeId = null,
    oldestProbeRepetitionId = null,
    repetitionIds = [],
  } = {}, userTimeZone = null) {
    if (userTimeZone === null) {
      throw new Error('You must provide userTimeZone');
    }
    return new ParticipantProjectDashboardEventModel({
      id, // This field is '<eventId><userId>'
      userId,
      projectId,
      eventId,
      isActive,
      eventType: EventTypes[eventType],
      name: eventName,
      incentiveAmount: eventIncentiveAmount,
      opensOn: moment.tz(eventOpensOn, userTimeZone),
      closesOn: moment.tz(eventClosesOn, userTimeZone),
      timeZone: eventTimeZone,
      completedOn: moment.tz(eventCompletedOn, userTimeZone),
      repeatUnit: RepeatUnits[repeatUnit],
      firstParticipantResponseOn: moment.tz(firstParticipantResponseOn, userTimeZone),
      lastParticipantResponseOn: moment.tz(lastParticipantResponseOn, userTimeZone),
      minimumRepetitionCompletionCount,
      maximumRepetitionCompletionCount,
      totalIntervalCount,
      totalIntervalCompletionCount,
      missedIntervalCount,
      intervalRepetitionCompletionCount,
      activeIntervalCompletedOn: moment.tz(activeIntervalCompletedOn, userTimeZone),
      totalRepetitionCompletionCount,
      lastCompletedRepetitionId,
      activeRepetitionId,
      activeRepetitionClosesOn: moment.tz(activeRepetitionClosesOn, userTimeZone),
      activeRepetitionHasReceivedResponse,
      activeRepetitionStatus: CompletionStatuses[activeRepetitionStatus],
      nextIntervalAvailableOn: moment.tz(nextIntervalAvailableOn, userTimeZone),
      probeCount,
      probes: probes.map(p => new ParticipantFollowupOverviewModel({
        id: p.probeId,
        responseTimeStamp: p.probedOn,
        entryId: p.repetitionId,
      })),
      oldestProbeId,
      oldestProbeRepetitionId,
      repetitionIds,
    });
  }

  setTimeBasedFields() {
    const now = moment();
    const openComparison = now.diff(this.opensOn);
    const closeComparison = now.diff(this.closesOn);
    this.isUpcoming = openComparison < 0;
    this.isOpen = openComparison >= 0 && closeComparison < 0;
    this.isClosed = closeComparison >= 0;
  }

  // This is to provide an order for sorting on the participant project dashboard
  // The order was recommended and there was some agreement (but no definitive sign-off) here:
  // https://2020ip.slack.com/archives/G079VNDH9/p1479495894000129
  compareTo(other) {
    // NOTE:  I'm caching these computed values to save computation - also doing the same below
    const thisIsOpen = this.isOpen;
    const otherIsOpen = other.isOpen;

    if (thisIsOpen && !otherIsOpen) {
      return -1;
    } else if (!thisIsOpen && otherIsOpen) {
      return 1;
    } else if (thisIsOpen && otherIsOpen) {
      // compare by minimum satisfied or not
      const thisMinimumSatisfied = this.isCurrentIntervalMinimumSatisfied;
      const otherMinimumSatisfied = other.isCurrentIntervalMinimumSatisfied;

      if (!thisMinimumSatisfied && otherMinimumSatisfied) {
        return -1;
      } else if (thisMinimumSatisfied && !otherMinimumSatisfied) {
        return 1;
      } else if (thisMinimumSatisfied && otherMinimumSatisfied) {
        // both minimums are satisfied, check maximums
        const thisMaximumSatisfied = this.isCurrentIntervalMaximumSatisfied;
        const otherMaximumSatisfied = other.isCurrentIntervalMaximumSatisfied;

        if (!thisMaximumSatisfied && otherMaximumSatisfied) {
          return -1;
        } else if (thisMaximumSatisfied && !otherMaximumSatisfied) {
          return 1;
        }
      }

      // neither event's minimum has been satisfied for the current interval, sort by due date
      return this.currentIntervalClosesOn.diff(other.currentIntervalClosesOn);
    }

    // both events are closed, sort by recently closed
    return other.closesOn.diff(this.closesOn);
  }

  clone() {
    return new ParticipantProjectDashboardEventModel(this);
  }

  @computedFrom(
    'intervalRepetitionCompletionCount',
    'minimumRepetitionCompletionCount',
    'totalRepetitionCompletionCount',
    'isRepeating',
  )
  get isCurrentIntervalMinimumSatisfied() {
    return ((this.isRepeating && this.intervalRepetitionCompletionCount >=
    this.minimumRepetitionCompletionCount) || (!this.isRepeating &&
    this.totalRepetitionCompletionCount >=
    this.minimumRepetitionCompletionCount));
  }

  @computedFrom(
    'intervalRepetitionCompletionCount',
    'maximumRepetitionCompletionCount',
    'totalRepetitionCompletionCount',
    'isRepeating',
  )
  get isCurrentIntervalMaximumSatisfied() {
    return ((this.isRepeating && this.intervalRepetitionCompletionCount ===
    this.maximumRepetitionCompletionCount) || (!this.isRepeating &&
    this.totalRepetitionCompletionCount ===
    this.maximumRepetitionCompletionCount));
  }

  @computedFrom(
    'isRepeating',
    'totalIntervalCompletionCount',
    'totalIntervalCount',
    'totalRepetitionCompletionCount',
    'minimumRepetitionCompletionCount',
  )
  get isTotallyCompleted() {
    return this.isRepeating ?
      this.totalIntervalCompletionCount >= this.totalIntervalCount :
      this.totalRepetitionCompletionCount >= this.minimumRepetitionCompletionCount;
  }

  @computedFrom('repeatUnit')
  get isRepeating() {
    return this.repeatUnit.int > 1;
  }

  @computedFrom('closesOn', 'nextIntervalAvailableOn')
  get currentIntervalClosesOn() {
    return this.nextIntervalAvailableOn.isValid() ? this.nextIntervalAvailableOn : this.closesOn;
  }
}
