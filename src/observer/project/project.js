import { EventAggregator } from 'aurelia-event-aggregator';
import { Api } from 'api/api';
import { IdentityClient } from '2020-identity';
import { ViewState } from 'shared/app-state/view-state';
import { ParentViewState } from 'shared/app-state/parent-view-state';
import { DomainState } from 'shared/app-state/domain-state';
import { ProjectChangedEvent } from 'shared/events/project-changed-event';
import { CurrentUser } from 'shared/current-user';
import { DateTimeService } from 'shared/components/date-time-service';
import { actions } from 'researcher/state/all-actions';
import configureUnknownRoutes from 'shared/utility/configure-unknown-routes';

const longDateFormat = 'LL';

export class Project {
  static inject = [
    'ResearcherEventClient',
    EventAggregator,
    Api,
    IdentityClient,
    DomainState,
    CurrentUser,
    ViewState,
    DateTimeService,
    'store',
  ];

  constructor(
    eventClient,
    ea,
    api,
    identityClient,
    domainState,
    currentUser,
    viewState,
    dateTimeService,
    store,
  ) {
    this.eventClient = eventClient;
    this.ea = ea;
    this.api = api;
    this.identityClient = identityClient;
    this.domainState = domainState;
    this.currentUser = currentUser;
    this.viewState = viewState;
    this.dateTimeService = dateTimeService;
    this.store = store;
  }

  async canActivate({ projectId }) {
    const [project, projectUser] = await Promise.all([
      this.api.query.projects.get(projectId),
      this.identityClient.getMyProjectUser(projectId),
    ]);
    this.store.dispatch(actions.project.set(project));
    this.store.dispatch(actions.projectUsers.fetch({ projectId: project.id }));

    this.project = project;
    this.projectUser = projectUser;
    this.domainState.currentProjectUser = projectUser;
  }

  activate() {
    this.channels = [`observer-project-${this.project.id}`];
    if (this.currentUser.isSuperUser) {
      this.channels.push(`project-${this.project.id}`);
    }

    this.eventClient.subscribeToChannels(this.channels);

    this.domainState.project = this.project;
    const upUrl = getUpUrl(this.router.history.fragment);
    const subtitle = `${this.dateTimeService
      .fromUtc(this.project.openTime, this.project.timeZone, longDateFormat)
    } - ${this.dateTimeService
      .fromUtc(this.project.closeTime, this.project.timeZone, longDateFormat)
    }`;

    this.viewState.parentStateStack.push(new ParentViewState({
      title: this.project.privateName,
      subtitle,
      titleIcon: 'icon-folder',
      navItems: this.router.navigation,
      backButtonRoute: upUrl,
      isResearcherRoute: true,
      statItems: [{
        iconClass: 'icon-noun_640064',
        title: 'Active Events:',
        value: this.project.activeEventCount,
      }, {
        iconClass: 'icon-person',
        title: 'Active Users:',
        value: this.project.projectUserCount,
      }, {
        iconClass: 'icon-ion-chatbubble',
        title: 'Total Posts:',
        value: this.project.totalResponseCount,
      }],
    }));

    this.subscribe();
  }

  deactivate() {
    this.unsubscribe();
    this.viewState.parentStateStack.pop();
    this.eventClient.unsubscribeFromChannels(this.channels);
  }

  subscribe() {
    this.projectChangedSub = this.ea.subscribe(ProjectChangedEvent, event => {
      this.project = event.project;
      this.domainState.header.title = this.project.privateName;
    });
  }

  unsubscribe() {
    this.projectChangedSub.dispose();
  }

  configureRouter(config, router) {
    config.map([
      {
        route: ['', 'events'],
        name: 'events',
        moduleId: './events',
        nav: true,
        title: 'Events',
        settings: {
          iconClass: 'icon-ion-calendar',
        },
      },
      {
        route: ['individual-activities/:iaId'],
        name: 'activity',
        moduleId: 'observer/individual-activity/individual-activity',
        nav: false,
        title: 'Individual Activity',
        settings: {
          breadIcon: 'icon-noun_640064',
        },
      },
    ]);

    configureUnknownRoutes(config);
    this.router = router;
  }
}

const projectsUrlRegex = /.+observer/i;
function getUpUrl(currentFragment) {
  const match = projectsUrlRegex.exec(currentFragment);
  if (match === null) {
    throw new Error('Unable to determine [up/back] URL - REGEX did not match.');
  }

  return `/#${match[0]}`;
}
