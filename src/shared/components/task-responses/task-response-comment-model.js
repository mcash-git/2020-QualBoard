import { computedFrom } from 'aurelia-framework';
import { Validator } from '2020-aurelia';
import moment from 'moment-timezone';

export class TaskResponseCommentModel {
  constructor({
    id = null,
    individualActivityId = null,
    isActive = true,
    isProbe = false,
    parentResponseId = null,
    projectId = null,
    userId = null,
    repetitionId = null,
    responseTimeStamp = null,
    taskPromptId = null,
    text = null,

    // not on the original server model:
    user = null,
    responses = [],
  } = {}, currentUserTimeZone) {
    if (!parentResponseId) {
      throw new Error('TaskResponseCommentModels require parentResponseId');
    }
    this.id = id;
    this.individualActivityId = individualActivityId;
    this.isActive = isActive;
    this.isProbe = isProbe;
    this.parentResponseId = parentResponseId;
    this.projectId = projectId;
    this.userId = userId;
    this.repetitionId = repetitionId;
    this.responseTimeStamp = responseTimeStamp;
    this.respondedOn = moment.tz(responseTimeStamp, currentUserTimeZone);
    this.taskPromptId = taskPromptId;
    this.text = text;

    this.user = user;

    this.responses = responses;

    this.isParticipant = this.user && this.user.role === 3;
    this.liClass = this.isParticipant ? 'ptp-comment' : 'mod-comment';
  }

  _initializeValidation() {
    this.validator = new Validator(this);
  }

  // TODO:  Move to task-response-comment-model.
  @computedFrom('isProbe', 'responses')
  get isUnansweredProbe() {
    return this.isProbe && (!this.responses || this.responses.length === 0);
  }
}
