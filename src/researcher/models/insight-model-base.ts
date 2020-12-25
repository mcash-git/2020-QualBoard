import { Annotation } from '2020-annotations';
import moment from 'moment-timezone';
import { InsightCommentModel } from './insight-comment-model';

export interface IInsightModelBase {
  id:string;
  comments:InsightCommentModel[];
  projectUser:any;
  createdOn:moment;
  targetId:string|null;
}

export abstract class InsightWriteModelBase implements IInsightModelBase {
  constructor(model:IInsightModelBase) {
    const { id, comments, projectUser, createdOn, targetId } = model;
    this.id = id;
    this.comments = comments.map(c => new InsightCommentModel(c));
    this.projectUser = projectUser;
    this.createdOn = createdOn;
    this.targetId = targetId;
  }

  public id:string;
  public targetId:string|null;
  public comments:InsightCommentModel[];
  public projectUser:any;
  public createdOn:moment;

  abstract toAnnotation() : Annotation;
  abstract toReadModel() : InsightReadModelBase;
}

export abstract class InsightReadModelBase implements IInsightModelBase {
  constructor(model:IInsightModelBase) {
    const { id, comments, projectUser, createdOn, targetId } = model;
    this._id = id;
    this._comments = comments.map(c => new InsightCommentModel(c));
    this._projectUser = projectUser;
    this._createdOn = createdOn;
    this._targetId = targetId;
  }

  private _id:string;
  private _targetId:string|null;
  private _comments:InsightCommentModel[];
  private _projectUser:any;
  private _createdOn:moment;

  public get id() : string {
    return this._id;
  }

  public get comments() : InsightCommentModel[] {
    return this._comments;
  }

  public get targetId() : string {
    return this._targetId;
  }

  public get projectUser() : any {
    return this._projectUser;
  }

  public get createdOn() : moment {
    return this._createdOn;
  }

  abstract toWriteModel() : InsightWriteModelBase;
}
