import { enums } from '2020-qb4';
import * as moment from 'moment-timezone';
import { ParticipantEntryOverviewModel } from './participant-entry-overview-model';
import { ParticipantFollowupOverviewModel } from './participant-followup-overview-model';

const RepeatUnits = enums.repeatUnits;

interface IParticipantIndividualActivityModel {
  id?: string | null;
  projectId?: string | null;
  name?: string | null;
  repeatUnit?: string | null;
  activeEntryId?: string | null;
  requiredFollowups?: any;
  defaultModeratorUserId?: string | null;
  entries?: any;
  opensOn?: string | null;
  closesOn?: string | null;
}

export class ParticipantIndividualActivityModel implements IParticipantIndividualActivityModel {
  public id: string | null;
  public projectId: string | null;
  public name: string | null;
  public repeatUnit: string | null;
  public activeEntryId: string | null;
  public requiredFollowups: any;
  public defaultModeratorUserId: string | null;
  public entries: any;

  constructor(model: IParticipantIndividualActivityModel) {
    this.id = model.id || null;
    this.name = model.name || null;
    this.projectId = model.projectId || null;
    this.repeatUnit = model.repeatUnit || null;
    this.activeEntryId = model.activeEntryId || null;
    this.requiredFollowups = model.requiredFollowups || [];
    this.defaultModeratorUserId = model.defaultModeratorUserId || null;
    this.entries = model.entries || [];
  }

  static fromDto(dto: any, userTimeZone: string) {
    const {
      id = null,
      projectId = null,
      publicName = null,
      openDateTime = null,
      closeDateTime = null,
      repeatUnit = 0,
      activeEntryId = null,
      requiredFollowups = [],
      defaultModeratorUserId = null,
      entries = [],
    } = dto;
    return new ParticipantIndividualActivityModel({
      id,
      projectId,
      name: publicName,
      opensOn: moment.tz(openDateTime, userTimeZone),
      closesOn: moment.tz(closeDateTime, userTimeZone),
      repeatUnit: RepeatUnits[repeatUnit],
      activeEntryId,
      requiredFollowups: requiredFollowups
        .map(f => ParticipantFollowupOverviewModel.fromDto(f))
        .sort((a, b) => a.responseTimeStamp.localeCompare(b.responseTimeStamp)),
      defaultModeratorUserId,
      entries: entries.map(e => ParticipantEntryOverviewModel.fromDto(e)),
    });
  }

  clone(overwriteProps: any = {}) {
    return new ParticipantIndividualActivityModel({
      id: this.id,
      name: this.name,
      projectId: this.projectId,
      repeatUnit: this.repeatUnit,
      activeEntryId: this.activeEntryId,
      requiredFollowups: this.requiredFollowups,
      defaultModeratorUserId: this.defaultModeratorUserId,
      entries: this.entries,
      ...overwriteProps,
    });
  }
}
