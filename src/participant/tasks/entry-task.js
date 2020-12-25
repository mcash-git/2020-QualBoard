import { bindable, computedFrom } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Api } from 'api/api';
import { enums } from '2020-qb4';
import { DialogService } from 'aurelia-dialog';
import { ViewState } from 'shared/app-state/view-state';
import { CurrentUser } from 'shared/current-user';
import { ParticipantTaskResponseWriteModel } from 'participant/models/participant-task-response-write-model';
import { fetchStatuses } from 'shared/enums/fetch-statuses';
import { MediaDescriptorModel } from 'shared/media/media-descriptor-model';
import { receiveTaskResponse } from 'participant/state/actions/all';
import { participantStore } from 'participant/state/participant-store';

const PromptTypes = enums.promptTypes;

export class EntryTask {
  static inject = [
    Element,
    EventAggregator,
    Api,
    DialogService,
    ViewState,
    CurrentUser,
  ];

  constructor(element, ea, api, dialogService, viewState, currentUser) {
    this.element = element;
    this.ea = ea;
    this.api = api;
    this.dialogService = dialogService;
    this.viewState = viewState;
    this.currentUser = currentUser;
    this.froalaEventHandlers = {
      'froalaEditor.initialized': (event, editor) => {
        setTimeout(() => { editor.events.focus(); }, 0);
      },
    };
  }

  @bindable task;
  @bindable moderatorId;
  @bindable projectUser;
  @bindable entryId;
  @bindable projectId;
  @bindable accountId;
  @bindable isLastTask;
  @bindable shouldAutoScroll = true;

  attached() {
    this.dragOver = 0;
    if (this.task.response === null && this.shouldAutoScroll) {
      this.scroll();
    }
  }

  bind() {
    this.taskChanged(this.task);
  }

  taskChanged(task) {
    if (task && !task.hasResponse) {
      this.responseWriteModel = ParticipantTaskResponseWriteModel.fromTask(task, this.entryId);
    }
  }

  handleDrop(event) {
    this.dragOver = 0;

    if (this.canAcceptMedia) {
      this.mediaUploader.handleFileDrop(event.dataTransfer.files);
    }
  }

  handleDrag(isOver) {
    this.dragOver += isOver ? 1 : -1;
  }

  handleUpload(assets) {
    this.responseWriteModel.mediaItems = [
      ...this.responseWriteModel.mediaItems,
      ...assets.map(a => MediaDescriptorModel.fromAsset(a)),
    ];
    // WRITE MODEL CHANGE - add any assets being uploaded to the response media collection
  }

  attachMedia() {
    this.mediaUploader.openFileDialog();
  }

  async submitTaskResponse() {
    if (!this.responseWriteModel.isValid) {
      return;
    }

    // submit to API - handle status / error.  Send optimistic update on API response successful
    this.status = fetchStatuses.pending;
    try {
      const apiResponse = await this.api.command.taskResponses.create({
        ...this.responseWriteModel.toDto(),
        projectId: this.projectId,
      });

      if (apiResponse.id) {
        this.status = fetchStatuses.success;
        // optimistic update with the ID
        participantStore
          .dispatch(receiveTaskResponse(this.responseWriteModel.toReadModelWithId(
            apiResponse.id,
            this.currentUser.timeZone,
          )));
      } else {
        this.status = fetchStatuses.failure;
        // error handling.
      }
    } catch (e) {
      this.status = fetchStatuses.failure;
    }
  }

  scroll() {
    this.viewState.scrollIntoView(this.element);
  }

  // NOTE: I would prefer to initialize the task to these computed properties, but there is a chance
  // that at some point, we will reuse this custom element when the mod is building the IA, so these
  // properties could foreseeably change, so @computedFrom it is.

  @computedFrom('task.type', 'task.isResponseTextRequired')
  get commentInstructions() {
    if (this.task.type.value === PromptTypes.text.value) {
      return 'Please enter your response';
    }
    if (this.task.isResponseTextRequired) {
      return 'Please comment on your response:';
    }
    return 'You may comment on your response:';
  }

  @computedFrom('isResponding')
  get responseBlockClass() {
    // WILL NEED TO REWORK THIS
    return this.isResponding ? 'is-responding-to' : '';
  }

  @computedFrom('task.type')
  get iconClass() {
    return this.task.type.icon;
  }

  @computedFrom('task.type')
  get viewModel() {
    let vmSegment;

    const type = PromptTypes[this.task.type.int];
    switch (type) {
      case PromptTypes.text:
        vmSegment = 'text';
        break;
      case PromptTypes.notice:
        vmSegment = 'notice';
        break;
      case PromptTypes.multipleChoice:
        vmSegment = 'multiple-choice';
        break;
      case PromptTypes.multipleAnswer:
        vmSegment = 'multiple-answer';
        break;
      case PromptTypes.matrixMultipleChoice:
        vmSegment = 'matrix-multiple-choice';
        break;
      case PromptTypes.matrixMultipleAnswer:
        vmSegment = 'matrix-multiple-answer';
        break;
      default:
        throw new Error('Unsupported prompt type:', type);
    }

    return `participant/components/task-responses/${vmSegment}/${vmSegment}${
      this.task.hasResponse ? '-completed' : ''}`;
  }

  @computedFrom('task.type')
  get canAcceptMedia() {
    return this.task.type.value !== PromptTypes.notice.value;
  }

  @computedFrom('task.type', 'dragOver', 'this.task.hasResponse')
  get taskClass() {
    return [
      `event-item${this.task.hasResponse ? ' answered' : ''}`,
      this.task.type.value === PromptTypes.notice.value ? 'notice' : '',
      this.hasDragOverClass ? 'drag-over' : '',
    ].filter(str => str !== '').join(' ');
  }

  get hasDragOverClass() {
    return this.dragOver
      && !this.task.hasResponse
      && this.canAcceptMedia;
  }

  @computedFrom(
    'responseWriteModel.isCoreValid',
    'responseWriteModel.isMediaValid',
    'responseWriteModel.isCommentValid',
  )
  get disabledButtonTooltip() {
    if (!this.responseWriteModel) {
      return '';
    }

    if (!this.responseWriteModel.isCoreValid) {
      return 'You have not yet completed the task.';
    }

    if (!this.responseWriteModel.isCommentValid) {
      return 'Comment required.';
    }

    if (!this.responseWriteModel.isMediaValid) {
      return 'Media required.';
    }

    return '';
  }

  @computedFrom('isLastTask')
  get buttonText() {
    return this.isLastTask ? 'Finish' : 'OK';
  }
}

