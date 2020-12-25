import { computedFrom, bindable, bindingMode } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ViewState } from 'shared/app-state/view-state';
import { CurrentUser } from 'shared/current-user';
import { DomainState } from 'shared/app-state/domain-state';

export class ModeratorViewTaskResponseComment {
  static inject = [Element, EventAggregator, ViewState, DomainState, CurrentUser];

  constructor(element, ea, viewState, domainState, user) {
    this.element = element;
    this.ea = ea;
    this.viewState = viewState;
    this.domainState = domainState;
    this.user = user;
  }
  
  @bindable({ defaultBindingMode: bindingMode.twoWay }) response;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) expandTo;

  attached() {
    if (this.expandTo && this.response.id === this.expandTo.followupId) {
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
    this.element.dispatchEvent(new CustomEvent('respond', {
      bubbles: true,
      detail: this,
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

  @computedFrom('response.user', 'response.user.role')
  get isModerator() {
    return this.response.user.role === 0;
  }

  @computedFrom('response.user', 'response.user.role')
  get isParticipant() {
    return this.response.user.role === 3;
  }

  @computedFrom('response.isProbe', 'response.responses')
  get isUnansweredProbe() {
    return this.response.isUnansweredProbe;
  }

  @computedFrom('user.timeZone')
  get timeZone() {
    return this.user.timeZone;
  }
}
