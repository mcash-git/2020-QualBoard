import { enums } from '2020-qb4';
import * as moment from 'moment-timezone';
import { ParticipantTaskModel } from './participant-task-model';

const CompletionStatuses = enums.completionStatuses;

interface IParticipantEntryModel {
  id?: string | null;
  completionStatus?: any;
  isLastTask?: boolean;
  completedTasks?: any;
  nextTask?: any | null;
  intervalClosesOn?: string | null;
  isOptimistic?: boolean;
}

export class ParticipantEntryModel implements IParticipantEntryModel {
  public id: string | null;
  public completionStatus: any;
  public isLastTask: boolean;
  public completedTasks: any;
  public nextTask: any | null;
  public intervalClosesOn: string | null;
  public isOptimistic: boolean;

  constructor(model: IParticipantEntryModel) {
    this.id = model.id || null;
    this.completionStatus = model.completionStatus || CompletionStatuses.started;
    this.isLastTask = model.isLastTask || false;
    this.completedTasks = model.completedTasks || [];
    this.nextTask = model.nextTask || null;
    this.intervalClosesOn = model.intervalClosesOn || null;
    this.isOptimistic = model.isOptimistic || false;
  }

  static fromDto(
    response: any,
    mediaApiUrl: string,
    imageUriBase: string,
    userTimeZone: string,
    projectUserLookup: string,
    isOptimistic?: boolean
  ): ParticipantEntryModel {
    return new ParticipantEntryModel({
      id: response.id || null,
      completionStatus: CompletionStatuses[response.completionStatus || 0],
      isLastTask: response.isLastTask || false,
      completedTasks: response.completedTasks
        .map(t => ParticipantTaskModel.fromDto(
          t,
          mediaApiUrl,
          imageUriBase,
          userTimeZone,
          projectUserLookup,
        )),
      nextTask: response.nextTask ?
        ParticipantTaskModel.fromDto(
          response.nextTask,
          mediaApiUrl,
          imageUriBase,
          userTimeZone,
          projectUserLookup,
        ) :
        null,
      isOptimistic: isOptimistic || false,
      intervalClosesOn: moment.tz(response.intervalClosesOn, userTimeZone),
    });
  }

  clone(overwriteProps: any = {}): ParticipantEntryModel {
    return new ParticipantEntryModel({
      id: this.id,
      completionStatus: this.completionStatus,
      isLastTask: this.isLastTask,
      completedTasks: this.completedTasks.map(ct => ct.clone()),
      nextTask: this.nextTask && this.nextTask.clone(),
      ...overwriteProps,
    });
  }
}
