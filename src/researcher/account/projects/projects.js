import { computedFrom } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { Api } from 'api/api';
import { DomainState } from 'shared/app-state/domain-state';
import { ViewState } from 'shared/app-state/view-state';
import { ChildViewState } from 'shared/app-state/child-view-state';
import { growlProvider } from 'shared/growl-provider';
import { safeSessionStorage } from 'shared/utility/safe-session-storage';
import { ProjectCardModel } from './project-card-model';

const projectsActionBarModulePath =
  'researcher/account/projects/projects-action-bar';
const addProjectModalPath = 'researcher/account/projects/create-project-modal';
const maxRetryCount = 10;

export class Projects {
  static inject = [
    Api,
    DialogService,
    DomainState,
    ViewState,
  ];

  constructor(api, dialogService, domainState, viewState) {
    this.api = api;
    this.dialogService = dialogService;
    this.domainState = domainState;
    this.viewState = viewState;
  }

  // pre-load stuff, anything we need to grab from api
  async canActivate({
    accountId = null,
  }) {
    this.accountId = accountId;
    this._searchTextSessionStorageKey = `accounts:${accountId}:projects-search`;
    this.searchText = safeSessionStorage.getItem(this._searchTextSessionStorageKey) || '';
    await this.getProjects();

    return true;
  }

  activate() {
    this.viewState.childStateStack.push(new ChildViewState({
      actionBarModel: this,
      actionBarViewModel: projectsActionBarModulePath,
    }));

    this.cardElements = [];
  }

  deactivate() {
    this.viewState.childStateStack.pop();
  }

  async getProjects() {
    this.projects = await this.api.query.accounts.projects(this.accountId);
    this.domainState.projects = this.projects;
    this.applySearch();
  }

  async addProject() {
    this.dialogService.open({
      viewModel: addProjectModalPath,
      model: this,
    });
  }

  async handleProjectAdded(projectId) {
    // clear search because it may filter out the project you just added.
    this.searchText = '';

    // HACK - SSE Debt - get projects until we find the project we just
    // created OR we try more than 10 times.  (That # is arbitrary and seems
    // reasonable for this hack)
    let count = 0;
    while (this.projects.every(p => p.id !== projectId)
      && count++ < maxRetryCount) {
      /* eslint-disable */
      await this.getProjects(this.accountId);
      /* eslint-enable */
    }

    // the cards will be in the same order.
    const projectIndex = this.projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
      growlProvider.error(
        'Hmm, Something Went Wrong.',
        'There appears to have been a problem creating the project.  ' +
        'Please try again.  If the problem persists, contact support.',
      );
      return;
    }

    const cardElement = this.cardElements[projectIndex];
    cardElement.classList.add('throb-twice');
    this.viewState.scrollIntoView(cardElement);
  }

  applySearch() {
    this.projectCards = this.projects
      .filter(p => !this.search || p.publicName.toLowerCase().includes(this.search) ||
        p.privateName.toLowerCase().includes(this.search))
      .map(p => new ProjectCardModel(p, true));
    safeSessionStorage.setItem(this._searchTextSessionStorageKey, this.search);
  }

  // @computedFrom('searchText')
  get search() {
    return this.searchText && this.searchText.trim().toLowerCase();
  }

  @computedFrom('projects.length')
  get noProjectsText() {
    return this.projects.length === 0 ?
      'This account has no projects.' :
      'Your filters did not match any projects.';
  }
}
