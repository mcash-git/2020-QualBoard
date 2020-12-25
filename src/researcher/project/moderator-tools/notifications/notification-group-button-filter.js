import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { CssHelper } from 'shared/css-helper';
import { bindable, bindingMode } from 'aurelia-framework';
import { DomainState } from 'shared/app-state/domain-state';
import { MessagingClient } from '2020-messaging';

export class NotificationGroupButtonFilter {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) appliedFilters;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) unreadCounts;

  static inject = [Router, EventAggregator, CssHelper, MessagingClient, DomainState];

  constructor(router, ea, cssHelper, messaging, domainState) {
    this.router = router;
    this.ea = ea;
    this.cssHelper = cssHelper;
    this.messaging = messaging;
    this.domainState = domainState;

    this.options = [{
      type: 'all',
      badge: 0,
      text: 'All',
      isVisible: false,
    }, {
      type: 'project',
      badge: 0,
      text: 'Project',
      isVisible: false,
    }, {
      type: 'event',
      badge: 0,
      text: 'Event',
      isVisible: false,
    }];
    this.totalProjectUnread = 0;
    this.totalEventUnread = 0;
    this.totalUnread = 0;
  }

  attached() {
    this.appliedFilters.group = [];

    this.getRoutes();
    this.subscription = this.ea.subscribe(
      'router:navigation:success',
      ::this.getRoutes,
    );

    this.fetchCounts = this.ea.subscribe('fetch-unread-counts', () => {
      this.fetchTotalUnreadCounts();
    });
  }

  getRoutes() {
    this.isEventRoute = false;
    this.isProjectRoute = false;
    this.isNewRoute = true;

    let newProjectId = null;
    let newIaId = null;
    const instructions = this.router.currentInstruction.getAllInstructions();

    instructions.forEach(i => {
      if (i.config.name.includes('activity')) {
        newProjectId = i.lifecycleArgs[0].projectId;
        newIaId = i.lifecycleArgs[0].iaId;
        this.isEventRoute = true;
      } else if (i.config.name === 'project') {
        newProjectId = i.lifecycleArgs[0].projectId;
        this.isProjectRoute = true;
      }
    });

    if (this.projectId) {
      this.isNewRoute = this.projectId !== newProjectId;
    }


    this.projectId = newProjectId;
    this.iaId = newIaId;

    this.computeGroupShow();

    if (this.isNewRoute) {
      this.ea.publish('fetch-notifications');
    }

    this.fetchTotalUnreadCounts();

    return true;
  }

  computeGroupShow() {
    this.options.forEach(o => {
      // set ids
      if (this.iaId && o.type === 'event') {
        o.iaId = this.iaId;
        o.projectId = this.projectId;
      } else if (this.projectId && o.type === 'project') {
        o.projectId = this.projectId;
      }

      // based on the route figure out what buttons to show and make active
      if ((this.isProjectRoute || this.isEventRoute)
        && (o.type === 'project' || o.type === 'all')) {
        o.isVisible = true;
        if (o.type === 'project') {
          this.appliedFilters.group = o;
        }
      } else if (this.isEventRoute && o.type === 'event') {
        o.isVisible = true;
      } else {
        o.isVisible = false;
        if (o.type === 'all') {
          this.appliedFilters.group = o;
        }
      }
    });
  }

  async fetchTotalUnreadCounts() {
    let prefix = 'tt://';
    let projectPrefix = null;
    let eventPrefix = null;

    if (this.projectId) {
      prefix += `projects/${this.projectId}`;
      projectPrefix = prefix;

      if (this.iaId) {
        prefix += `/events/${this.iaId}`;
        eventPrefix = prefix;
      }
    }

    const data = await this.messaging.notifications.getCounts(prefix);

    this.domainState.unreadNoticeCount = data.totalUnread || 0;
    this.totalUnread = this.domainState.unreadNoticeCount;
    this.totalProjectUnread = data.getSegmentCount(projectPrefix);
    this.totalEventUnread = data.getSegmentCount(eventPrefix);
  }

  onChangeOpt(option) {
    this.appliedFilters.group = option;
    this.ea.publish('fetch-notifications');
    return true;
  }

  detached() {
    this.subscription.dispose();
    this.fetchCounts.dispose();
  }
}
