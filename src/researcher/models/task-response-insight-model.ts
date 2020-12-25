import * as moment from 'moment-timezone';
import { IInsightModelBase, InsightReadModelBase, InsightWriteModelBase } from "./insight-model-base";
import { ParticipantTaskResponseModel } from 'participant/models/participant-task-response-model';
import { Annotation, SpecificResourceTarget, TextualBody } from '2020-annotations';
import { InsightCommentModel } from './insight-comment-model';
import { getUuidFromUrn } from 'shared/utility/get-uuid-from-urn';
import { regexFactory } from 'shared/utility/regex-factory';

export interface ITaskResponseInsightModel extends IInsightModelBase {
  projectId:string;
  response:ParticipantTaskResponseModel;
}

export class TaskResponseInsightWriteModel extends InsightWriteModelBase implements ITaskResponseInsightModel {
  constructor(model:ITaskResponseInsightModel) {
    super(model);

    const { projectId, response } = model;
    this.projectId = projectId;
    this.response = response;
  }

  public projectId:string;
  public response:ParticipantTaskResponseModel;

  public toReadModel() : TaskResponseInsightReadModel {
    return new TaskResponseInsightReadModel(this);
  }

  public toAnnotation() : Annotation {
    return toAnnotation(this);
  }
}

export class TaskResponseInsightReadModel extends InsightReadModelBase implements ITaskResponseInsightModel {
  constructor(model:ITaskResponseInsightModel) {
    const init = {
      ...model,
      comments: model.comments.filter(comment => comment.text && comment.text.trim()),
    };
    super(init);

    const { projectId, response } = model;
    this._projectId = projectId;
    this._response = response;
  }

  private _projectId:string;
  private _response:ParticipantTaskResponseModel;

  static fromAnnotation(
    annotation:Annotation,
    projectUserLookup:Map<string,any>,
    responseLookup:Map<string,ParticipantTaskResponseModel>,
    userTimeZone:string,
    ) : TaskResponseInsightReadModel {
    const target = <SpecificResourceTarget> annotation.targets.get()[0];
    const [, projectId, responseId] = regexFactory.getTaskResponseInsightIriRegex().exec(target.iri);
    const userId = getUuidFromUrn(annotation.meta.creator.id);
    const targetId = target.id;
    const response = responseLookup.get(responseId);
    const comments = annotation.bodies.get()
      .map(body => InsightCommentModel.fromTextualBody(<TextualBody>body, projectUserLookup, userTimeZone));
    return new TaskResponseInsightReadModel({
      projectId,
      response,
      comments,
      targetId,
      id: annotation.id,
      createdOn: moment.tz(annotation.meta.created, userTimeZone),
      projectUser: projectUserLookup.get(userId),
    })
  }

  public get projectId() : string {
    return this._projectId;
  }

  public get response() : ParticipantTaskResponseModel {
    return this._response;
  }

  public toWriteModel() : TaskResponseInsightWriteModel {
    return new TaskResponseInsightWriteModel(this);
  }
}

function toAnnotation(insight:ITaskResponseInsightModel) : Annotation {
  const annotation = new Annotation();

  annotation.bodies.set(insight.comments
    .filter(comment => comment.text && comment.text.trim())
    .map(comment => comment.toTextualBody()));

  const target = new SpecificResourceTarget(`qb:/projects/${insight.projectId}/task-responses/${
    insight.response.id}`);
  target.id = insight.targetId;

  annotation.targets.set([target]);

  annotation.id = insight.id;

  return annotation;
}

