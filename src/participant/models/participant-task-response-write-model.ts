import { computedFrom } from 'aurelia-framework';
import { enums } from '2020-qb4';
import moment from 'moment-timezone';
import { ParticipantTaskResponseModel } from 'participant/models/participant-task-response-model';

const PromptTypes = enums.promptTypes;

interface IParticipantTaskResponseWriteModel {
  task: any;
  type?: any;
  entryId: string | null;
  text?: string | null;
  mediaItems?: any;
  responseOptions?: any;
  matrixResponses?: any;
}

export class ParticipantTaskResponseWriteModel implements IParticipantTaskResponseWriteModel {
  public task: any;
  public type: any;
  public entryId: string | null;
  public text: string | null;
  public mediaItems: any;
  public responseOptions: any;
  public matrixResponses: any;

  constructor (model: IParticipantTaskResponseWriteModel) {
    if (!model.task) {
      throw new Error('You must supply the task');
    }
    if (!model.entryId) {
      throw new Error('You must supply the entryId');
    }
    this.task = model.task;
    this.type = PromptTypes[model.task.type.int];
    this.entryId = model.entryId;
    this.text = model.text || '';
    this.mediaItems = model.mediaItems || [];
    this.responseOptions = model.responseOptions || [];
    this.matrixResponses = model.matrixResponses || [];
  }

  static fromTask(task: any = null, entryId: any = null): ParticipantTaskResponseWriteModel {
    return new ParticipantTaskResponseWriteModel({
      entryId,
      task,
    });
  }

  toDto() {
    const dto = {
      repetitionId: this.entryId,
      entryId: this.entryId,
      text: this.text,
      media: this.mediaItems.map(m => m.toDto()),
      taskId: this.task.id,
      iaId: this.task.individualActivityId,
    };
    return { ...dto, ...this._getRelevantFields() };
  }

  toReadModelWithId(id, userTimeZone) {
    return new ParticipantTaskResponseModel({
      entryId: this.entryId,
      user: [],
      text: this.text,
      mediaItems: this.mediaItems,
      responseOptions: this.responseOptions,
      matrixResponses: this.matrixResponses,
      id,
      taskId: this.task.id,
      isOptimistic: true,
      respondedOn: moment.tz(userTimeZone),
    });
  }

  private _getRelevantFields() {
    const type = PromptTypes[this.task.type.int];
    switch (type) {
      case PromptTypes.multipleChoice:
      case PromptTypes.multipleAnswer:
        return { responseOptions: this.responseOptions.map(o => o.optionId) };
      case PromptTypes.matrixMultipleChoice:
      case PromptTypes.matrixMultipleAnswer:
        return {
          matrixResponses: this.matrixResponses.map(mr => ({
            rowId: mr.rowId,
            columnId: mr.columnId,
          })),
        };
      default:
        return {};
    }
  }

  @computedFrom(
    'type',
    'text',
    'responseOptions.length',
    'matrixResponses.length',
    'task.isResponseTextRequired',
    'task.isMediaRequired',
    'mediaItems.length',
    'task.minResponseOptions',
    'task.maxResponseOptions',
    )
  get isValid() {
    if (this.type === PromptTypes.notice) {
      return true;
    }

    return this.isMediaValid && this.isCommentValid && this.isCoreValid;
  }
  @computedFrom(
    'type',
    'text',
    'responseOptions.length',
    'matrixResponses.length',
    'task.maxResponseOptions',
    'task.minResponseOptions',
    )
  get isCoreValid() {
    switch (this.type) {
      case PromptTypes.text:
        return this.hasText;
      case PromptTypes.multipleChoice:
        return validateMultipleChoice(this.task, this);
      case PromptTypes.multipleAnswer:
        return validateMultipleAnswer(this.task, this);
      case PromptTypes.matrixMultipleChoice:
        return validateMatrixMultipleChoice(this.task, this);
      case PromptTypes.matrixMultipleAnswer:
        return validateMatrixMultipleAnswer(this.task, this);
      default:
        return true;
    }
  }

  @computedFrom('task.isMediaRequired', 'mediaItems.length')
  get isMediaValid() {
    return !this.task.isMediaRequired || this.hasMedia;
  }

  @computedFrom('task.isResponseTextRequired', 'text')
  get isCommentValid() {
    return !this.task.isResponseTextRequired || this.hasText;
  }

  @computedFrom('text')
  get hasText() {
    return this.text && this.text.trim();
  }

  @computedFrom('mediaItems.length')
  get hasMedia() {
    return this.mediaItems && this.mediaItems.length > 0;
  }
}

function validateMultipleChoice(task, response) {
  const opts = response.responseOptions;

  return opts.length === 1 &&
    taskHasOption(task, opts[0]);
}

function validateMultipleAnswer(task, response) {
  const opts = response.responseOptions;
  const min = task.minResponseOptions;
  const max = task.maxResponseOptions || null;
  return opts.length >= min &&
    (max === null || opts.length <= max) &&
    opts.every(o => taskHasOption(task, o));
}

function taskHasOption(task, option) {
  return task.availableOptions.find(o => o.optionId === option.optionId) !== undefined;
}

function validateMatrixMultipleChoice(task, response) {
  return task.matrixRows.every(row => response.matrixResponses.some(mr => mr.rowId === row.rowId));
}

function validateMatrixMultipleAnswer(task, response) {
  return task.matrixRows.every(row => {
    const numRowChoices = response.matrixResponses.filter(mr => mr.rowId === row.rowId).length;
    return numRowChoices >= task.minResponseOptions &&
      (task.maxResponseOptions === null || numRowChoices <= task.maxResponseOptions);
  });
}
