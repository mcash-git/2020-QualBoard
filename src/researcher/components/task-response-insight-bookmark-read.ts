import { bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { CurrentUser } from 'shared/current-user';
import { events } from '../individual-activity/responses/entries/insight-ea-events';
import { ITaskResponseInsightModel } from '../models/task-response-insight-model';

export class TaskResponseInsightBookmarkRead {
  static inject = [Element, EventAggregator, CurrentUser];

  constructor(element:Element, ea:EventAggregator, currentUser:CurrentUser) {
    this.element = element;
    this.ea = ea;
    this.currentUser = currentUser;
  }

  element:Element;
  @bindable insight:ITaskResponseInsightModel;
  isMouseOver:boolean;
  ea:EventAggregator;
  currentUser:CurrentUser;

  editClick(event) : void {
    event.stopPropagation();
    this.element.dispatchEvent(new CustomEvent('edit', {
      bubbles: true,
    }));
  }

  removeClick(event) : void {
    event.stopPropagation();
    this.element.dispatchEvent(new CustomEvent('remove', {
      bubbles: true,
    }));
  }

  click() : void {
    this.ea.publish(events.scrollToResponse, { responseId: this.insight.response.id});
  }

  handleMouseEnter() : void {
    if (this.isMouseOver) {
      return;
    }

    this.isMouseOver = true;
    this.element.dispatchEvent(new CustomEvent('insight-bookmark-hover', {
      bubbles: true,
      detail: { insight: this.insight },
    }));
  }

  handleMouseLeave(event) : void {
    this.isMouseOver = false;
    this.element.dispatchEvent(new CustomEvent('insight-bookmark-hover-end', {
      bubbles: true,
      detail: { insight: this.insight },
    }));
  }
}
