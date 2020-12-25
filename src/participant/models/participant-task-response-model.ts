import * as moment from 'moment-timezone';
import { computedFrom } from 'aurelia-framework';
import { MediaDescriptorModel } from 'shared/media/media-descriptor-model';

interface IParticipantTaskResponseModel {
  id?: string | null;
  individualActivityId?: string | null;
  userId?: string | null;
  user: any;
  taskId?: string | null;
  entryId?: string | null;
  parentResponseId?: string | null;
  text?: string | null;
  plainText?: string | null;
  mediaItems?: any;
  responseOptions?: any;
  matrixResponses?: any;
  isRequiredFollowup?: boolean;
  responses?: any;
  respondedOn?: moment | null;
  parentResponse?: any;
  isOptimistic?: boolean | null;
  hasResponse?: boolean | null;
}

export class ParticipantTaskResponseModel implements IParticipantTaskResponseModel {
  public id: string | null;
  public individualActivityId: string | null;
  public userId: string | null;
  public user: any;
  public taskId: string | null;
  public entryId: string | null;
  public parentResponseId: string | null;
  public text: string | null;
  public plainText: string | null;
  public mediaItems: any;
  public matrixResponses: any;
  public responseOptions: any;
  public isRequiredFollowup: boolean;
  public responses: any;
  public respondedOn: moment | null;
  public parentResponse: any;
  public isOptimistic: boolean | null;
  public hasResponse: boolean | null;

  constructor (model: IParticipantTaskResponseModel) {
    this.id = model.id || null;
    this.individualActivityId = model.individualActivityId || null;
    this.userId = model.userId || null;
    this.user = model.user || null;
    this.taskId = model.taskId || null;
    this.entryId = model.entryId || null;
    this.parentResponseId = model.parentResponseId || null;
    this.text = model.text || null;
    this.plainText = model.text || null;
    this.mediaItems = model.mediaItems || [];
    this.responseOptions = model.responseOptions || [];
    this.matrixResponses = model.matrixResponses || [];
    this.isRequiredFollowup = model.isRequiredFollowup || false;
    this.responses = model.responses || [];
    this.respondedOn = model.respondedOn || null;
    this.parentResponse = model.parentResponse || null;
    this.isOptimistic = model.isOptimistic || false;
    this.hasResponse = model.hasResponse || false;
  }

  static fromDto(
    dto: any,
    task: any = null,
    mediaApiUrl: string = null,
    imageUriBase: string = null,
    userTimeZone: string = null,
    projectUserLookup: any = null,
    parentResponse: any = null,
    isOptimistic: boolean = false,
  ): ParticipantTaskResponseModel {
    const {
      id = null,
      individualActivityId = null,
      userId = null,
      taskPromptId = null,
      repetitionId = null,
      entryId = null,
      parentResponseId = null,
      text = '',
      plainText = '',
      media = [],
      responseOptions = [],
      matrixResponses = [],
      isProbe = false,
      responses = [],
      responseTimeStamp = null,
    } = dto;
    const model = new ParticipantTaskResponseModel({
      id,
      individualActivityId,
      userId,
      user: projectUserLookup.get(userId),
      taskId: taskPromptId,
      entryId: entryId || repetitionId,
      parentResponseId,
      text,
      plainText,
      mediaItems: media.map(m => new MediaDescriptorModel({ ...m, mediaApiUrl, imageUriBase })),
      matrixResponses,
      responseOptions,
      isRequiredFollowup: isProbe,
      respondedOn: moment.tz(responseTimeStamp, userTimeZone),
      parentResponse,
      isOptimistic,
    });

    model.responses = responses
      .map(r => ParticipantTaskResponseModel
        .fromDto(r,
          task,
          mediaApiUrl,
          imageUriBase,
          userTimeZone,
          projectUserLookup,
          model,
        ));

    model.responseOptions = responseOptions
      .map(optionId => task.availableOptions.find(o => o.optionId === optionId));

    model.hasResponse = responses.length > 0;

    return model;
  }

  @computedFrom('isRequiredFollowup', 'responses.length')
  get isUnansweredRequiredFollowup() {
    return this.isRequiredFollowup && !this.hasResponse;
  }

  clone(overwriteProps: any): ParticipantTaskResponseModel {
    return new ParticipantTaskResponseModel({
      id: this.id,
      individualActivityId: this.individualActivityId,
      userId: this.userId,
      user: this.user,
      taskId: this.taskId,
      entryId: this.entryId,
      parentResponseId: this.parentResponseId,
      text: this.text,
      plainText: this.plainText,
      isRequiredFollowup: this.isRequiredFollowup,
      respondedOn: this.respondedOn,
      parentResponse: this.parentResponse,
      isOptimistic: this.isOptimistic,
      hasResponse: this.hasResponse,
      mediaItems: [...this.mediaItems],
      responseOptions: [...this.responseOptions],
      matrixResponses: [...this.matrixResponses],
      responses: [...this.responses],
      ...overwriteProps,
    });
  }
}
