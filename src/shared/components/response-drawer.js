import { bindable, bindingMode, computedFrom } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Api } from 'api/api';
import { TaskResponseCommentModel } from 'shared/components/task-responses/task-response-comment-model';
import { ViewState } from 'shared/app-state/view-state';

export class ResponseDrawer {
  static inject = [
    Element,
    EventAggregator,
    Api,
    ViewState,
  ];

  constructor(element, ea, api, viewState) {
    this.element = element;
    this.ea = ea;
    this.api = api;
    this.viewState = viewState;
  }

  @bindable({ defaultBindingMode: bindingMode.oneTime }) projectId;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) entryId;

  unbind() {
    this._stopThrobCheck();
  }

  attached() {
    this.isInitialized = true;

    if (this.openOnAttach) {
      setTimeout(() => this._doOpen(this.openOnAttach), 0);
    }
  }

  detached() {
    this._stopThrobCheck();
  }

  async postResponse() {
    if (this.responseTextIsEmpty) {
      return;
    }

    this.response.iaId = this.response.individualActivityId;
    const apiResp = await this.api.command.taskResponses.create(this.response);

    if (apiResp.error) {
      this._responsePromiseReject(apiResp.error);
    }

    this.close({ parentResponseId: this.parentResponseModel.id });
  }

  async open(params = {}) {
    if (!this.isInitialized) {
      this.openOnAttach = params;
    } else {
      this._doOpen(params);
    }

    return new Promise((resolve, reject) => {
      this._responsePromiseResolve = resolve;
      this._responsePromiseReject = reject;
    });
  }

  setFocus() {
    this.element.querySelector('.fr-element').focus();
  }

  close(result) {
    this.isOpen = false;
    this.drawerElement.classList.remove('visible');
    this.ea.publish('response-drawer-closed');
    this.ea.publish('comment-responded');
    this._stopThrobCheck();
    this._responsePromiseResolve({
      wasCancelled: !result,
      result,
    });
  }

  scrollToResponse() {
    if (this.scrollFn && typeof (this.scrollFn === 'function')) {
      this.scrollFn(this.parentResponseElement);
    } else {
      this.viewState.scrollIntoView(this.parentResponseElement);
    }
  }

  _startThrobCheck() {
    this.throbCheckIntervalId = setInterval(() => {
      const elRect = this.parentResponseElement.getBoundingClientRect();
      const responseDrawerRect = this.element.querySelector('section')
        .getBoundingClientRect();
      const bottomOfHeader = this.isFullHeightView ?
        230 :
        (this.viewState.appHeadHeight +
          this.viewState.shortStickyHeight +
          this.viewState.actionBarHeight);

      const isVisible = elRect.top < responseDrawerRect.top &&
        elRect.bottom > bottomOfHeader;


      if (!isVisible) {
        this.replyButton.classList.add('link-back');
      } else {
        this.replyButton.classList.remove('link-back');
      }
    }, 200);
  }

  _stopThrobCheck() {
    clearInterval(this.throbCheckIntervalId);
    this.throbCheckIntervalId = null;
  }

  _doOpen(params) {
    const {
      parentResponseModel = null,
      parentResponseElement = null,
      canProbe = false,
    } = params;
    if (this.isOpen) {
      // clean up

      this.ea.publish('response-drawer-closed');
      this._stopThrobCheck();

      this._responsePromiseResolve({
        wasCancelled: true,
      });
    }
    this.scrollFn = params.scrollFn;
    this.isFullHeightView = params.isFullHeightView;
    this.isOpen = true;
    this.parentResponseModel = parentResponseModel;
    this.parentResponseElement = parentResponseElement;
    this.canProbe = canProbe;
    this.response = new TaskResponseCommentModel({
      taskPromptId: parentResponseModel.taskPromptId || parentResponseModel.taskId,
      individualActivityId: parentResponseModel.individualActivityId,
      projectId: this.projectId,
      repetitionId: parentResponseModel.repetitionId || parentResponseModel.entryId,
      parentResponseId: parentResponseModel.id,
      isProbe: canProbe,
    });
    this.drawerElement.classList.add('visible');
    this.setFocus();
    this._startThrobCheck();
  }

  @computedFrom('response.text')
  get responseTextIsEmpty() {
    return !this.response || !this.response.text || !this.response.text.trim();
  }
}
