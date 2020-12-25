import { enums } from '2020-qb4';

const RepeatUnits = enums.repeatUnits;
const CompletionStatuses = enums.completionStatuses;

interface IParticipantEntryOverviewModel {
  id?: string | null;
  repeatUnit?: any;
  repetitionIndex?: number;
  intervalIndex?: number;
  completionStatus: any;
}

export class ParticipantEntryOverviewModel implements IParticipantEntryOverviewModel {
  public id: string | null;
  public repeatUnit: any;
  public repetitionIndex: number;
  public intervalIndex: number;
  public completionStatus: any;

  constructor (model: IParticipantEntryOverviewModel) {
    this.id = model.id || null;
    this.repeatUnit = model.repeatUnit || RepeatUnits.none;
    this.repetitionIndex = model.repetitionIndex || 0;
    this.intervalIndex = model.intervalIndex || 0;
    this.completionStatus = model.completionStatus || CompletionStatuses.started;
  }

  static fromDto(dto: any): ParticipantEntryOverviewModel {
    const {
      id = null,
      repeatUnit = 0,
      repetitionIndex = 0,
      intervalIndex = 0,
      completionStatus = 0,
    } = dto;
    return new ParticipantEntryOverviewModel({
      id,
      repeatUnit: RepeatUnits[repeatUnit],
      repetitionIndex,
      intervalIndex,
      completionStatus: CompletionStatuses[completionStatus],
    });
  }

  clone(overwriteProps: any = {}) {
    return new ParticipantEntryOverviewModel({
      id: this.id,
      repeatUnit: this.repeatUnit,
      repetitionIndex: this.repetitionIndex,
      intervalIndex: this.intervalIndex,
      completionStatus: this.completionStatus,
      ...overwriteProps,
    });
  }
}
