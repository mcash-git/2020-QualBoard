import { MediaDescriptorModel } from 'shared/media/media-descriptor-model';

export class ParticipantTaskResponseModel {
  constructor({
    id = null,
    individualActivityId = null,
    projectId = null,
    userId = null,
    taskPromptId = null,
    repetitionId = null,
    parentResponseId = null,
    text = '',
    media = [],
    responseOptions = [],
    matrixResponses = [],
    isProbe = false,

    // Probes, comments, etc:
    responses = [],
    user = {},
    responseTimeStamp = null,

    // Not on original server model:
    mediaApiUrl = null,
    imageUriBase = null,

  } = {}) {
    this.id = id;
    this.individualActivityId = individualActivityId;
    // NOTE: projectId is not a property on the back end TaskResponse object.
    this.projectId = projectId;
    this.userId = userId;
    this.taskPromptId = taskPromptId;
    this.repetitionId = repetitionId;
    this.parentResponseId = parentResponseId;
    this.text = text;
    this.responseOptions = responseOptions;
    this.matrixResponses = matrixResponses;
    this.isProbe = isProbe;
    this.responses = responses;
    this.user = user;
    this.responseTimeStamp = responseTimeStamp;

    this.mediaApiUrl = mediaApiUrl;
    this.media = media.map(m => new MediaDescriptorModel({ ...m, mediaApiUrl, imageUriBase }));
  }
}
