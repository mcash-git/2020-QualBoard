import { HttpClient, json } from 'aurelia-fetch-client';
import { enums } from '2020-qb4';

const PromptTypes = enums.promptTypes;

export class TasksCommandApi {
  static inject = [HttpClient, 'QbApiHttpClient'];

  constructor(http, apiHttp) {
    apiHttp.baseUrl += 'projects/';
    this.http = http;
    this.toggle = true;
    this.apiHttp = apiHttp;
  }

  async create(command) {
    return (await this.apiHttp.fetch(`${command.projectId}/activities/${
      command.individualActivityId}/tasks`, {
      method: 'post',
      body: json(cleanTask(command)),
    })).json();
  }

  async update(command) {
    return (await this.apiHttp.fetch(`${command.projectId}/activities/${
      command.individualActivityId}/tasks/${command.id}/update`, {
      method: 'post',
      body: json(cleanTask(command)),
    })).json();
  }

  async delete(command) {
    return (await this.apiHttp.fetch(`${command.projectId}/activities/${
      command.individualActivityId}/tasks/${command.id}/delete`, {
      method: 'post',
    })).json();
  }
}

// These properties are relevant on every task.
const alwaysProperties = [
  'id',
  'title',
  'text',
  'type',
  'platformLimit',
  'media',
  'projectUserLogicRules',
  'taskLogicRules',
  'insertAfterTaskId',
  'sortOrder',
];

// Relevant properties on a given task type.
const relevantPropertyNames = {
  Text: [
    'mediaRequired',
  ],
  Notice: [],
  MultipleChoice: [
    'responseTextRequired',
    'mediaRequired',
    'autoWrapOptions',
    'options',
  ],
  MultipleAnswer: [
    'responseTextRequired',
    'mediaRequired',
    'autoWrapOptions',
    'minimumOptionsRequired',
    'maximumOptionsLimit',
    'options',
  ],
  MatrixMultipleChoice: [
    'responseTextRequired',
    'mediaRequired',
    'matrixColumns',
    'matrixRows',
    'matrixGroupTags',
  ],
  MatrixMultipleAnswer: [
    'responseTextRequired',
    'mediaRequired',
    'matrixColumns',
    'matrixRows',
    'minimumOptionsRequired',
    'maximumOptionsLimit',
    'matrixGroupTags',
  ],
  // TODO:  Add the rest, Media, Quallage, etc.
};

// Function to clean and remove any irrelevant settings/values from a task that
// may be hanging on due to how we handle binding and switching between task
// types in the builder.

// TODO: Move this functionality into the TaskModel.toDto() method
function cleanTask(task) {
  const fields = alwaysProperties.concat(getRelevantPropertyNames(task.type));

  const cleaned = {};
  fields.forEach(field => {
    cleaned[field] = task[field];
  });

  if (cleaned.options) {
    cleanOptions(cleaned.options);
  }

  return cleaned;
}

function getRelevantPropertyNames(type) {
  return relevantPropertyNames[PromptTypes[type].value] || [];
}

function cleanOptions(options) {
  options.forEach(o => {
    if (!o.optionId) {
      delete o.optionId;
    }
  });
}
