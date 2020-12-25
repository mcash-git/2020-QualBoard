import { bindable } from 'aurelia-framework';
import * as moment from 'moment-timezone';
import { ViewModes } from 'shared/enums/view-modes';
import { InsightCommentModel } from 'researcher/models/insight-comment-model';
import { CurrentUser } from 'shared/current-user';
import { TaskResponseInsightWriteModel } from '../models/task-response-insight-model';
import { events } from '../individual-activity/responses/entries/insight-ea-events';

export class TaskResponseInsightBookmarkWrite {
  static inject = [Element, CurrentUser];

  constructor(element, currentUser, ea) {
    this.element = element;
    this.currentUser = currentUser;
  }

  element:HTMLElement;
  currentUser:CurrentUser;
  textElement:HTMLElement;
  @bindable insight:TaskResponseInsightWriteModel;

  bind() : void {
    if (this.insight.comments.length === 0) {
      this.insight.comments.push(new InsightCommentModel({
        id: null,
        projectUser: this.insight.projectUser,
        text: '',
        createdOn: null,
      }))
    }
  }

  attached() : void {
    this.element.dispatchEvent(new CustomEvent('scroll-to-insight', {
      bubbles: true,
      detail: { element: this.element.parentElement },
    }));
    this.element.dispatchEvent(new CustomEvent('insight-bookmark-hover', {
      bubbles: true,
      detail: { insight: this.insight },
    }));

    this.textElement.focus();
  }

  detached() : void {
    this.element.dispatchEvent(new CustomEvent('insight-bookmark-hover-end', {
      bubbles: true,
      detail: { insight: this.insight },
    }))
  }

  cancelClick() : void {
    this.element.dispatchEvent(new CustomEvent('cancel', {
      bubbles: true,
    }));
  }

  saveClick() : void {
    this.element.dispatchEvent(new CustomEvent('save', {
      bubbles: true,
    }))
  }
}
