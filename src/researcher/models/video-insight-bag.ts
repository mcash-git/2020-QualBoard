import { ParticipantTaskResponseModel } from 'participant/models/participant-task-response-model';
import { IInsightBag, InsightBagBase } from './insight-bag-base';
import {
  VideoAssetInsightReadModel,
  VideoAssetInsightWriteModel,
} from '../models/video-asset-insight-model';

interface IVideoInsightBag extends IInsightBag {
  assetId:string;
  isEditing?:boolean;
  isLooping?:boolean;
}

export class VideoInsightBag extends InsightBagBase {
  public static viewModelPath = 'researcher/components/video-insight-bookmark';
  public readModel:VideoAssetInsightReadModel;
  public writeModel:VideoAssetInsightWriteModel;
  public isNew:boolean;

  constructor(init:IVideoInsightBag) {
    super(init);

    const { isEditing = false, assetId, isLooping = false, } = init;

    this.assetId = assetId;
    this.isEditing = isEditing;
    this.isLooping = isLooping;

    this.viewModelPath = VideoInsightBag.viewModelPath;
  }

  isEditing:boolean;
  assetId:string;
  isLooping:boolean;

  get start() : number {
    return this.isEditing ? this.writeModel.start : this.readModel.start;
  }

  set start(val:number) {
    if (!this.isEditing) {
      throw new Error('Unable to set read model "start" value.  Must change to edit mode and set' +
        'write model "start" value');
    }

    this.writeModel.start = val;
  }

  get end() : number {
    return this.isEditing ? this.writeModel.end : this.readModel.end;
  }

  set end(val:number) {

    if (!this.isEditing) {
      throw new Error('Unable to set read model "start" value.  Must change to edit mode and set' +
        'write model "start" value');
    }

    this.writeModel.end = val;
  }
}
