import { computedFrom } from 'aurelia-framework';
import { Api } from 'api/api';
import { CurrentUser } from 'shared/current-user';
import { DomainState } from 'shared/app-state/domain-state';
import { ViewState } from 'shared/app-state/view-state';
import { ChildViewState } from 'shared/app-state/child-view-state';
import { ProjectCardModel } from 'researcher/account/projects/project-card-model';
import { safeSessionStorage } from 'shared/utility/safe-session-storage';

const actionBarModulePath = 'researcher/project/my-projects-action-bar';
const searchTextSessionStorageKey = 'my-projects:projects-search';

// TODO:  Refactor some of the common logic between this and the accounts/projects class
export class MyProjects {
  static inject = [Api, DomainState, CurrentUser, ViewState];

  constructor(api, domainState, currentUser, viewState) {
    this.api = api;
    this.domainState = domainState;
    this.currentUser = currentUser;
    this.viewState = viewState;
  }

  async canActivate() {
    if (this.currentUser.isSuperUser) {
      this.projects = [];
    }
    this.searchText = safeSessionStorage.getItem(searchTextSessionStorageKey) || '';
    this.projects = await this.api.query.projects.moderatorDashboard();
    this.domainState.moderatorProjects = this.projects;
    this.applySearch();
  }
  
  activate() {
    this.viewState.childStateStack.push(new ChildViewState({
      actionBarModel: this,
      actionBarViewModel: actionBarModulePath,
    }));
  }
  
  deactivate() {
    this.viewState.childStateStack.pop();
  }
  
  applySearch() {
    this.projectCards = this.projects
      .filter(p => !this.search || p.publicName.toLowerCase().includes(this.search) ||
        p.privateName.toLowerCase().includes(this.search))
      .map(p => new ProjectCardModel(p, false));
    safeSessionStorage.setItem(searchTextSessionStorageKey, this.search);
  }
  
  get search() {
    return this.searchText && this.searchText.trim().toLowerCase();
  }
  
  @computedFrom('projects.length')
  get noProjectsText() {
    return this.projects.length === 0 ?
      'Your account is not associated with any active projects.' :
      'Your filters did not match any projects.';
  }
}
