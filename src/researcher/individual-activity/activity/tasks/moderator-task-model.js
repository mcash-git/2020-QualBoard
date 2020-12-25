import { computedFrom } from 'aurelia-framework';
import { enums } from '2020-qb4';
import { ParticipantTaskResponseModel } from 'shared/components/task-responses/participant-task-response-model';
import { MediaDescriptorModel } from 'shared/media/media-descriptor-model';
import { compareBySortOrder } from 'shared/utility/compare-by-sort-order';

const PromptTypes = enums.promptTypes;

export class ModeratorTaskModel {
  constructor({
    id = null,
    individualActivityId = null,
    sortOrder = 0,
    title = null,
    text = null,
    type = 0,
    isActive = true,
    autoWrapOptions = true,
    options = [],
    matrixColumns = [],
    matrixRows = [],
    totalResponses = 0,
    userCompletions = [],
    projectUserLookup = {},
    flowType = 'normal',
    platformLimit = 0,
    responseTextRequired = false,
    media = [],
    mediaRequired = false,
    minimumOptionsRequired = 1,
    maximumOptionsLimit = null,
    mediaApiUrl = null,
    imageUriBase = null,
  } = {}) {
    this.id = id;
    this.individualActivityId = individualActivityId;
    this.sortOrder = sortOrder;
    this.title = title;
    this.text = text;
    this.type = type;
    this.isActive = isActive;
    this.autoWrapOptions = autoWrapOptions;

    this.options = options.sort(compareBySortOrder);
    this.matrixColumns = matrixColumns.sort(compareBySortOrder);
    this.matrixRows = matrixRows.sort(compareBySortOrder);

    this.totalResponses = totalResponses;

    this.userCompletions = userCompletions.map(uc => {
      uc.user = projectUserLookup[uc.userId];
      return uc;
    });

    this.projectUserLookup = projectUserLookup;
    this.flowType = flowType;

    this.platformLimit = platformLimit;
    this.responseTextRequired = responseTextRequired;

    this.mediaApiUrl = mediaApiUrl;
    this.media = media.map(m => new MediaDescriptorModel({
      ...m,
      mediaApiUrl,
      imageUriBase,
    }));

    this.mediaRequired = mediaRequired;
    this.minimumOptionsRequired = minimumOptionsRequired;
    this.maximumOptionsLimit = maximumOptionsLimit;

    const promptType = PromptTypes[type].value;

    // This allows us to use the same validation as we are using for [M.]M.A.
    if (promptType.endsWith('MultipleChoice')) {
      this.minimumOptionsRequired = 1;
      this.maximumOptionsLimit = 1;
    }

    // This is an empty task response, for displaying the task's appearance
    this.taskResponse = new ParticipantTaskResponseModel();
  }

  @computedFrom('type')
  get completedViewModel() {
    return `${this.viewModel}-completed`;
  }

  @computedFrom('type')
  get viewModel() {
    const vm = getViewModelName(this.type);

    return `researcher/individual-activity/activity/tasks/${vm}/${vm}`;
  }

  @computedFrom('type')
  get iconClass() {
    return PromptTypes[this.type].icon;
  }

  @computedFrom('taskResponse', 'taskResponse.id')
  get hasResponse() {
    return this.taskResponse && this.taskResponse.id;
  }
}

function getViewModelName(typeInt) {
  const err = () => {
    throw new Error('Unrecognized type value:', typeInt);
  };

  const type = PromptTypes[typeInt];

  return ({
    Text: () => 'text',
    Notice: () => 'notice',
    MultipleChoice: () => 'multiple-choice',
    MultipleAnswer: () => 'multiple-answer',
    MatrixMultipleChoice: () => 'matrix-multiple-choice',
    MatrixMultipleAnswer: () => 'matrix-multiple-answer',
  }[type.value] || err)();
}
