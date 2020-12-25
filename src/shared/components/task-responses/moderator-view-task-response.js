import { bindable, bindingMode, computedFrom } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ViewState } from 'shared/app-state/view-state';
import { CurrentUser } from 'shared/current-user';
import { DomainState } from 'shared/app-state/domain-state';

export class ModeratorViewTaskResponse {
  static inject = [Element, EventAggregator, ViewState, CurrentUser, DomainState];

  constructor(element, ea, viewState, currentUser, domainState) {
    this.element = element;
    this.ea = ea;
    this.viewState = viewState;
    this.currentUser = currentUser;
    this.domainState = domainState;
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) response;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) task;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) expandTo;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) isActivityOpen;

  activate({ response, task, isActivityOpen }) {
    this.response = response;
    this.task = task;
    this.isActivityOpen = isActivityOpen;

    this.bind();
  }

  attached() {
    if (this.expandTo && this.response.id === this.expandTo.responseId
        && !this.expandTo.followupId) {
      setTimeout(() => this.viewState.scrollIntoView(this.element), 100);
    }
  }

  bind() {
    this.canUserFollowUp = this.domainState.currentProjectUser &&
      this.domainState.currentProjectUser.role === 0;
  }

  respond() {
    if (this.isResponding) {
      return;
    }
    this.isResponding = true;
    const highlightElement = this.element.tagName === 'MODERATOR-VIEW-TASK-RESPONSE' ?
      this.element :
      this.element.querySelector('.comment-body');
    this.element.dispatchEvent(new CustomEvent('respond', {
      bubbles: true,
      // The use of querySelector() is because in a compose, we don't have access to the ref element
      detail: { response: this.response, element: highlightElement },
    }));

    this.drawerClosedSubscription = this.ea.subscribe('response-drawer-closed', () => {
      this.drawerClosedSubscription.dispose();
      this.isResponding = false;
    });
  }

  @computedFrom(
    'response.user.role',
    'isResponding',
    'response.isProbe',
    'response.responses.length',
  )
  get liClasses() {
    const classes = [];
    if (this.isParticipant) {
      classes.push('ptp-comment');
      if (this.isUnansweredProbe) {
        classes.push('unanswered-probe');
      }
    } else {
      classes.push('mod-comment');
    }

    if (this.isResponding) {
      classes.push('is-responding-to');
    }
    return classes.join(' ');
  }

  @computedFrom('response.user.role')
  get isModerator() {
    return this.response.user.role === 0;
  }

  @computedFrom('response.user.role')
  get isParticipant() {
    return this.response.user.role === 3;
  }

  @computedFrom('response.isProbe', 'response.responses')
  get isUnansweredProbe() {
    return this.response.isUnansweredProbe;
  }

  @computedFrom('currentUser.timeZone')
  get timeZone() {
    return this.currentUser.timeZone;
  }

  @computedFrom('isActivityOpen', 'currentUserIsModerator', 'currentUserIsSuperUser')
  get disabledButtonTooltip() {
    if (!this.isActivityOpen) {
      return 'The event is closed.';
    } else if (!this.currentUserIsModerator && this.currentUserIsSuperUser) {
      return 'Psst, hey super user!  You are not a moderator on this project!';
    }
    return null;
  }
}
