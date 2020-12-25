import { bindable, bindingMode, computedFrom } from 'aurelia-framework';
import { CurrentUser } from 'shared/current-user';
import { EventAggregator } from 'aurelia-event-aggregator';

export class Comment {
  static inject = [CurrentUser, EventAggregator];
  
  constructor(currentUser, ea) {
    this.currentUser = currentUser;
    this.ea = ea;
  }
  
  @bindable({ defaultBindingMode: bindingMode.oneWay }) response;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) isFollowup;
  
  bind() {
    this.respondSubscriptions = [
      this.ea.subscribe('comment-responding', payload => {
        const { parentResponse } = payload;
        this.isRespondingTo = parentResponse.id === this.response.id;
      }),
      this.ea.subscribe('comment-responded', () => {
        this.isRespondingTo = false;
      }),
    ];
  }
  
  unbind() {
    if (this.respondSubscriptions) {
      this.respondSubscriptions.forEach(sub => sub.dispose());
    }
  }
  
  replyClick() {
    this.ea.publish('comment-responding', {
      parentResponse: this.response,
      parentResponseElement: this.liElement,
    });
  }
  
  @computedFrom('isFollowup', 'response.isRequiredFollowup', 'isRespondingTo')
  get classes() {
    return `${this.isFollowup ? 'mod-comment' : 'ptp-comment'}${
      this.response.isUnansweredRequiredFollowup ? ' unanswered-followup' : ''}${
      this.isRespondingTo ? ' is-responding-to' : ''}`;
  }
}
