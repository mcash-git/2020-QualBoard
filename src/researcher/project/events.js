import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import { computedFrom, observable } from 'aurelia-framework';
import { Api } from 'api/api';
import { DialogService } from 'aurelia-dialog';
import { growlProvider } from 'shared/growl-provider';
import { DomainState } from 'shared/app-state/domain-state';
import { ViewState } from 'shared/app-state/view-state';
import { ChildViewState } from 'shared/app-state/child-view-state';
import { ProjectChangedEvent } from 'shared/events/project-changed-event';
import { safeSessionStorage } from 'shared/utility/safe-session-storage';
import { EventCardModel } from './event-card-model';

const eventsActionBarModulePath = 'researcher/project/events/events-action-bar';
const addIaModalPath =
  'researcher/individual-activity/create-individual-activity-modal';
const maxRetryCount = 10;

export class Events {
  static inject = [
    EventAggregator,
    Api,
    DialogService,
    Router,
    DomainState,
    ViewState,
  ];

  constructor(ea, api, dialogService, router, domainState, viewState) {
    this.ea = ea;
    this.api = api;
    this.dialogService = dialogService;
    this.router = router;
    this.domainState = domainState;
    this.viewState = viewState;
  }

  @observable searchText;

  async canActivate(params) {
    this._searchTextSessionStorageKey = `projects:${params.projectId}:events-search`;
    this.searchText = safeSessionStorage.getItem(this._searchTextSessionStorageKey) || '';
    this.projectId = params.projectId;
    this.accountId = params.accountId;
    await this.fetchEvents(params);
  }

  activate() {
    this.project = this.domainState.project;
    this.domainState.project.events = this.events || [];
    this.viewState.childStateStack.push(new ChildViewState({
      actionBarViewModel: eventsActionBarModulePath,
      actionBarModel: this,
    }));
    this.subscribe();
    this.cardElements = [];

    this.project.instructions = {
      title: this.project.instructionTitle,
      text: this.project.instructionText,
    };
  }

  async searchTextChanged() {
    if (!this.eventCards) {
      return;
    }

    setImmediate(() => { this.applySearch(); });
  }

  deactivate() {
    this.unsubscribe();
    this.viewState.childStateStack.pop();
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

  async fetchEvents() {
    this.events = await this.api.query.projects.events(this.projectId);

    if (this.domainState.project) {
      this.domainState.project.events = this.events;
    }

    this.eventCards = this.events.map(e => new EventCardModel(e, this.accountId));
    this.applySearch();
  }

  show = true;

  toggle() {
    this.show = !this.show;
  }

  async addIndividualActivityClick() {
    this.dialogService.open({
      viewModel: addIaModalPath,
      model: {
        projectId: this.projectId,
        projectTimeZone: this.project.timeZone,
      },
    }).whenClosed(result => {
      if (result.wasCancelled) {
        return;
      }

      this.handleIndividualActivityAdded(result.output);
    });
  }

  async handleIndividualActivityAdded(ia) {
    let count = 0;
    while (this.events.every(e => e.id !== ia.id)
    && count++ < maxRetryCount) {
      /* eslint-disable */
      await this.fetchEvents();
      /* eslint-enable */
    }

    // the cards will be in the same order.
    const iaIndex = this.events.findIndex(e => e.id === ia.id);

    if (iaIndex === -1) {
      growlProvider.error(
        'Hmm, Something Went Wrong.',
        'There appears to have been a problem creating the activity.  ' +
        'Please try again.  If the problem persists, contact support.',
      );
      return;
    }

    const cardElement = this.cardElements[iaIndex];


    cardElement.classList.add('throb-twice');
    this.viewState.scrollIntoView(cardElement);
  }

  applySearch() {
    this.filtered = this.eventCards
      .filter(e => !this.search || e.event.publicName.toLowerCase().includes(this.search) ||
        e.event.privateName.toLowerCase().includes(this.search));
    safeSessionStorage.setItem(this._searchTextSessionStorageKey, this.search);
  }

  // @computedFrom('searchText')
  get search() {
    return this.searchText && this.searchText.trim().toLowerCase();
  }

  @computedFrom('accountId', 'projectId')
  get settingsUrl() {
    return `/#/accounts/${this.accountId}/projects/${this.projectId}/settings`;
  }
}
