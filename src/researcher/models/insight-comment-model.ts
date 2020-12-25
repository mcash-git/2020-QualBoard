import * as moment from 'moment-timezone';
import { TextualBody, CreationMeta, Agent } from '2020-annotations';
import { getUuidFromUrn } from 'shared/utility/get-uuid-from-urn';

export interface IInsightCommentModel {
  id:string;
  text:string;
  projectUser:any;
  createdOn:moment;
}

export class InsightCommentModel implements IInsightCommentModel {
  public id:string;
  public text:string;
  public projectUser:any;
  public createdOn:moment;

  constructor(model:IInsightCommentModel) {
    const { text, projectUser, createdOn, id } = model;

    this.id = id;
    this.text = text;
    this.projectUser = projectUser;
    this.createdOn = createdOn;
  }

  static fromTextualBody(
    body:TextualBody,
    projectUserLookup:Map<string,any>,
    userTimeZone:string,
  ) : InsightCommentModel {

    const userId = getUuidFromUrn(body.meta.creator.id);
    return new InsightCommentModel({
      id: body.id,
      text: body.value,
      projectUser: projectUserLookup.get(userId),
      createdOn: moment.tz(body.meta.created, userTimeZone),
    });
  }

  toTextualBody() : TextualBody {
    return TextualBody.parse({
      value: this.text,
      id: this.id,
    });
  }
}
