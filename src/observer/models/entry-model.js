import moment from 'moment-timezone';
import { computedFrom } from 'aurelia-framework';
import { enums } from '2020-qb4';

const RepeatUnits = enums.repeatUnits;
const CompletionStatuses = enums.completionStatuses;
const ReadStatuses = enums.readStatuses;

const nouns = {
  2: 'Day',
  3: 'Week',
  4: 'Month',
};

export class EntryModel {
  constructor({
    id = null,
    participantId = null,
    participant = null,
    eventId = null,
    projectId = null,
    startedOn = moment.tz(null),
    closesOn = moment.tz(null),
    completedOn = moment.tz(null),
    completionStatus = null,
    repetitionIndex = null,
    intervalIndex = null,
    repeatUnit = null,
    readStatus = null,
  }) {
    this.id = id;
    this.participantId = participantId;
    this.iaId = eventId;
    this.projectId = projectId;
    this.startedOn = startedOn;
    this.closesOn = closesOn;
    this.completedOn = completedOn;
    this.completionStatus = completionStatus;
    this.repetitionIndex = repetitionIndex;
    this.intervalIndex = intervalIndex;
    this.repeatUnit = repeatUnit;
    this.participant = participant;
    this.readStatus = readStatus;
  }

  static fromDto({
    id = null,
    userId = null,
    eventId = null,
    projectId = null,
    startedOn = null,
    closesOn = null,
    completedOn = null,
    status = 0,
    repetitionIndex = null,
    intervalIndex = null,
    repeatUnit = 0,
    readStatuses = {},
  } = {}, currentUser = null, projectUserLookup = null) {
    if (currentUser === null) {
      throw new Error('You must supply currentUser');
    }
    if (projectUserLookup === null) {
      throw new Error('You must supply projectUserLookup');
    }

    const readStatusInt = readStatuses[currentUser.userId];
    const readStatus = readStatusInt && ReadStatuses[readStatusInt];
    return new EntryModel({
      id,
      participantId: userId,
      participant: projectUserLookup.get(userId),
      eventId,
      projectId,
      startedOn: moment.tz(startedOn, currentUser.timeZone),
      closesOn: moment.tz(closesOn, currentUser.timeZone),
      completedOn: moment.tz(completedOn, currentUser.timeZone),
      completionStatus: CompletionStatuses[status],
      repetitionIndex,
      intervalIndex,
      repeatUnit: RepeatUnits[repeatUnit],
      readStatus: readStatus || ReadStatuses.unread,
    });
  }

  @computedFrom('intervalIndex', 'index', 'repeatUnit')
  get text() {
    const repeatUnit = RepeatUnits[this.repeatUnit.int];
    if (repeatUnit === RepeatUnits.none) {
      return '';
    }

    const intervalText = repeatUnit === RepeatUnits.continuous ?
      '' :
      `${nouns[repeatUnit.int]} ${this.intervalIndex} - `;
    return `${intervalText}Entry ${this.repetitionIndex}`;
  }
}
