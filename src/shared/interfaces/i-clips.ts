import { IVideoAssetInsightModel } from 'researcher/models/video-asset-insight-model';
import { VideoInsightBag } from 'researcher/models/video-insight-bag';

export interface IClips {
  projectId:string;
  insights:VideoInsightBag[];
}
