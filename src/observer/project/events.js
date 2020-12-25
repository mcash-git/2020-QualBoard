import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import { observable } from 'aurelia-framework';
import { Api } from 'api/api';
import { DialogService } from 'aurelia-dialog';
import { DomainState } from 'shared/app-state/domain-state';
import { ViewState } from 'shared/app-state/view-state';
import { ChildViewState } from 'shared/app-state/child-view-state';
import { ProjectChangedEvent } from 'shared/events/project-changed-event';
import { safeSessionStorage } from 'shared/utility/safe-session-storage';
import { EventCardModel } from 'observer/models/event-card-model';

const eventsActionBarModulePath = 'observer/project/events/events-action-bar';

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
    this._searchTextSessionStorageKey = `obs-projects:${params.projectId}:events-search`;
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

    this.eventCards = this.events.map(e => new EventCardModel(e));
    this.applySearch();
  }

  show = true;

  toggle() {
    this.show = !this.show;
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
}
