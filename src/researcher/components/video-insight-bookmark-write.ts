import { computedFrom, bindable } from 'aurelia-framework';
import { InsightCommentModel } from 'researcher/models/insight-comment-model';
import { CurrentUser } from 'shared/current-user';
import { TaskResponseInsightWriteModel } from '../models/task-response-insight-model';

export class VideoInsightBookmarkWrite {
  static inject = [Element, CurrentUser];

  constructor(element:Element, currentUser:CurrentUser) {
    this.element = element;
    this.currentUser = currentUser;
  }

  element:Element;
  currentUser:CurrentUser;
  textElement:HTMLElement;

  @bindable insight:TaskResponseInsightWriteModel;
  @bindable isLooping:boolean;

  bind() : void {
    if (this.insight.comments.length === 0) {
      this.insight.comments.push(new InsightCommentModel({
        id: null,
        projectUser: this.insight.projectUser,
        text: '',
        createdOn: null,
      }));
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
    }));
  }

  cancelClick() : void {
    this.element.dispatchEvent(new CustomEvent('cancel', {
      bubbles: true,
    }));
  }

  saveClick() : void {
    this.element.dispatchEvent(new CustomEvent('save', {
      bubbles: true,
    }));
  }

  togglePlay() : void {
    this.element.dispatchEvent(new CustomEvent('toggle-play', {
      bubbles: true,
    }));
  }

  @computedFrom('isLooping')
  get loopPlaybackIcon() : string {
    return this.isLooping ? 'icon-pause' : 'icon-play_arrow';
  }
}
