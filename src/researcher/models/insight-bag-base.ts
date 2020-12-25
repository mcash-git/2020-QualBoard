import * as moment from 'moment-timezone';
import {
  InsightReadModelBase,
  InsightWriteModelBase,
} from '../models/insight-model-base';

export interface IInsightBag {
  readModel?:InsightReadModelBase;
  writeModel?:InsightWriteModelBase;
  isNew?:boolean;
}

export abstract class InsightBagBase {
  public readModel:InsightReadModelBase;
  public writeModel:InsightWriteModelBase;
  public isNew:boolean;
  public viewModelPath:string;

  constructor(init:IInsightBag) {
    const { readModel, writeModel, isNew } = init;

    this.readModel = readModel;
    this.writeModel = writeModel;
    this.isNew = isNew;
  }

  public get createdOn() : moment {
    return this.isNew ? moment() : this.readModel.createdOn;
  }

  public get eventAggregatorSuffix() : string {
    return this.isNew ? 'NEW' : this.readModel.id;
  }
}
