import { DialogService } from 'aurelia-dialog';
import { Api } from 'api/api';
import { DomainState } from 'shared/app-state/domain-state';
import { ViewState } from 'shared/app-state/view-state';
import { ParentViewState } from 'shared/app-state/parent-view-state';
import { DateTimeService } from 'shared/components/date-time-service';
import configureUnknownRoutes from 'shared/utility/configure-unknown-routes';
import { actions } from 'researcher/state/all-actions';

const longDateFormat = 'LL';

export class IndividualActivity {
  static inject = [
    Api,
    DomainState,
    DialogService,
    ViewState,
    DateTimeService,
    'store',
  ];

  constructor(api, domainState, modalService, viewState, dateTimeService, store) {
    this.api = api;
    this.domainState = domainState;
    this.modalService = modalService;
    this.viewState = viewState;
    this.dateTimeService = dateTimeService;
    this.store = store;
  }

  async canActivate({ accountId, projectId, iaId }) {
    this.accountId = accountId;
    this.projectId = projectId;
    this.iaId = iaId;

    const individualActivity = await this.api.query.individualActivities.get(projectId, iaId);
    individualActivity.accountId = this.accountId;

    this.store.dispatch(actions.individualActivity.set({ projectId, individualActivity }));

    this.individualActivity = individualActivity;
  }

  async activate() {
    const ia = this.individualActivity;
    const subtitle = `${
      this.dateTimeService.fromUtc(ia.openTime, ia.timeZone, longDateFormat)
    } - ${
      this.dateTimeService.fromUtc(ia.closeTime, ia.timeZone, longDateFormat)
    }`;
    this.viewState.parentStateStack.push(new ParentViewState({
      title: ia.privateName,
      subtitle,
      backButtonRoute: getUpUrl(this.router.history.fragment),
      titleIcon: 'icon-noun_640064',
      navItems: this.router.navigation,
      statItems: [{
        iconClass: 'icon-person',
        title: 'Active Participants:',
        value: ia.eventParticipantCount,
      }, {
        iconClass: 'icon-ion-chatbubble',
        title: 'Total Posts:',
        value: ia.totalResponseCount,
      }],
    }));

    this.domainState.individualActivity = ia;

    if (!this.domainState.project.events) {
      this.events = await this.api.query.projects.events(this.projectId);
      this.domainState.project.events = this.events;
    }
  }

  deactivate() {
    this.viewState.parentStateStack.pop();
  }

  configureRouter(config, router) {
    config.map([{
      route: '',
      redirect: 'responses',
    }, {
      route: ['responses'],
      name: 'responses',
      moduleId: '../../researcher/individual-activity/responses/activity-responses',
      nav: true,
      title: 'Responses',
      settings: {
        iconClass: 'icon-library_books',
      },
    }]);

    configureUnknownRoutes(config);
    this.router = router;
  }
}

const iaUrlRegex = /.+individual-activities/i;
function getUpUrl(currentFragment) {
  const match = iaUrlRegex.exec(currentFragment);
  if (match === null) {
    throw new Error('Unable to determine [up/back] URL - REGEX did not match.');
  }

  return `/#${match[0].replace('individual-activities', 'events')}`;
}
