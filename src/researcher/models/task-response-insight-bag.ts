import * as moment from 'moment-timezone';
import {
  InsightReadModelBase,
  InsightWriteModelBase,
} from '../models/insight-model-base';
import {
  IInsightBag,
  InsightBagBase,
} from './insight-bag-base';
import { ParticipantTaskResponseModel } from 'participant/models/participant-task-response-model';

interface ITaskResponseInsightBag extends IInsightBag {
  response?:ParticipantTaskResponseModel;
}

export class TaskResponseInsightBag extends InsightBagBase implements ITaskResponseInsightBag {
  public static viewModelPath:string = 'researcher/components/task-response-insight-bookmark';
  public readModel:InsightReadModelBase;
  public writeModel:InsightWriteModelBase;
  public response:ParticipantTaskResponseModel;
  public isNew:boolean;

  constructor(init:ITaskResponseInsightBag) {
    super(init);
    const { response } = init;

    this.response = response;

    this.viewModelPath = TaskResponseInsightBag.viewModelPath;
  }

  public get createdOn() : moment {
    return this.isNew ? moment() : this.readModel.createdOn;
  }

  public get eventAggregatorSuffix() : string {
    return this.isNew ? 'NEW' : this.readModel.id;
  }
}
