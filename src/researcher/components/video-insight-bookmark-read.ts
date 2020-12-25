import { computedFrom, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { CurrentUser } from 'shared/current-user';
import { events } from '../individual-activity/responses/entries/insight-ea-events';
import { IVideoAssetInsightModel } from '../models/video-asset-insight-model';

export class VideoInsightBookmarkRead {
  static inject = [Element, EventAggregator, CurrentUser];

  constructor(element:Element, ea:EventAggregator, currentUser:CurrentUser) {
    this.element = element;
    this.ea = ea;
    this.currentUser = currentUser;
  }

  element:Element;
  isMouseOver:boolean;
  ea:EventAggregator;
  currentUser:CurrentUser;

  @bindable insight:IVideoAssetInsightModel;
  @bindable isLooping:boolean;
  @bindable canEdit:boolean;

  editClick(event) : void {
    if (!this.canEdit) {
      return;
    }

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
    document.dispatchEvent(new CustomEvent('scroll-to-response-with-asset-id', { bubbles: true, detail: this.insight.assetId }));
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

  togglePlay() : void {
    this.element.dispatchEvent(new CustomEvent('toggle-play', {
      bubbles: true,
    }));
  }

  @computedFrom('isLooping')
  get loopPlaybackIcon() {
    return this.isLooping ? 'icon-pause' : 'icon-play_arrow';
  }
}
