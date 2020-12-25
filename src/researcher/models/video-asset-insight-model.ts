import * as moment from 'moment-timezone';
import { AssetModel } from '2020-media';
import { IInsightModelBase, InsightReadModelBase, InsightWriteModelBase } from "./insight-model-base";
import { Annotation, SpecificResourceTarget, TextualBody, TemporalMediaFragmentSelector } from '2020-annotations';
import { InsightCommentModel } from './insight-comment-model';
import { getUuidFromUrn } from 'shared/utility/get-uuid-from-urn';
import { regexFactory } from 'shared/utility/regex-factory';

export interface IVideoAssetInsightModel extends IInsightModelBase {
  projectId:string;
  assetId:string;
  fileName:string;
  start:number|null;
  end:number|null;
  videoDurationSeconds?:number|null;
}

export class VideoAssetInsightWriteModel extends
  InsightWriteModelBase implements IVideoAssetInsightModel {
  constructor(model:IVideoAssetInsightModel) {
    super(model);

    const { projectId, assetId, fileName, start, end, videoDurationSeconds } = model;

    this.projectId = projectId;
    this.assetId = assetId;
    this.fileName = fileName;
    this.start = start;
    this.end = end;
    this.videoDurationSeconds = videoDurationSeconds;
  }

  projectId:string;
  assetId:string;
  fileName:string;
  start:number|null;
  end:number|null;
  videoDurationSeconds:number|null;

  public toReadModel() : VideoAssetInsightReadModel {
    return new VideoAssetInsightReadModel(this);
  }

  public toAnnotation() : Annotation {
    return toAnnotation(this);
  }
}

export class VideoAssetInsightReadModel extends InsightReadModelBase implements IVideoAssetInsightModel {
  constructor(model:IVideoAssetInsightModel) {
    const init = {
      ...model,
      comments: model.comments.filter(comment => comment.text && comment.text.trim()),
    };
    super(init);

    const { projectId, assetId, fileName, start, end, videoDurationSeconds } = model;

    this._projectId = projectId;
    this._assetId = assetId;
    this._fileName = fileName;
    this._start = start;
    this._end = end;
    this._videoDurationSeconds = videoDurationSeconds;
  }

  private _projectId:string;
  private _assetId:string;
  private _fileName:string;
  private _start:number|null;
  private _end:number|null;
  private _videoDurationSeconds:number|null;

  static fromAnnotation(
    annotation:Annotation,
    projectUserLookup:Map<string,any>,
    userTimeZone:string,
  ) : VideoAssetInsightReadModel {
    // id, comments, projectUser, createdOn, response

    const target = <SpecificResourceTarget> (annotation.targets.get()[0]);
    const [, projectId, assetId] = regexFactory.getVideoInsightIriRegex().exec(target.iri);
    const targetId = target.id;
    const userId = getUuidFromUrn(annotation.meta.creator.id);
    const comments = annotation.bodies.get().map(body =>
      InsightCommentModel.fromTextualBody(<TextualBody>body, projectUserLookup, userTimeZone));

    const selector = <TemporalMediaFragmentSelector> (target.selector);

    return new VideoAssetInsightReadModel({
      projectId,
      assetId,
      fileName: target.name,
      targetId,
      comments,
      id: annotation.id,
      createdOn: moment.tz(annotation.meta.created, userTimeZone),
      projectUser: projectUserLookup.get(userId),
      start: selector && selector.fragment && selector.fragment.start,
      end: selector && selector.fragment && selector.fragment.end,
    })
  }

  public toWriteModel() : VideoAssetInsightWriteModel {
    return new VideoAssetInsightWriteModel(this);
  }

  get projectId() : string {
    return this._projectId;
  }

  get assetId() : string {
    return this._assetId;
  }

  get fileName() : string {
    return this._fileName;
  }

  get start() : number {
    return this._start;
  }

  get end() : number {
    return this._end;
  }

  get videoDurationSeconds() : number {
    return this._videoDurationSeconds;
  }
}

function toAnnotation(insight:IVideoAssetInsightModel) : Annotation {
  const annotation = new Annotation();

  annotation.bodies.set(insight.comments
    .filter(comment => comment.text && comment.text.trim())
    .map(comment => comment.toTextualBody()));

  const target = new SpecificResourceTarget(`qb:/projects/${insight.projectId}/video/${
    insight.assetId}`);

  // TODO: at some point, we might want to switch off from SpecificResource / fragment and just use
  // a "Video" type Target instead of "SpecificResource" with a selector
  const temporalMediaFragmentSelector = new TemporalMediaFragmentSelector(insight);

  target.select(temporalMediaFragmentSelector);
  target.name = insight.fileName;
  target.id = insight.targetId;

  // target.fileName = insight.asset.fileName;
  annotation.targets.set([target]);

  annotation.id = insight.id;

  return annotation;
}
