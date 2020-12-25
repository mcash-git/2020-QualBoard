import { BindingEngine, computedFrom } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Api } from 'api/api';
import moment from 'moment-timezone';
import { enums } from '2020-qb4';
import { UserCardModel } from 'researcher/project/users/user-card-model';
import { ViewState } from 'shared/app-state/view-state';
import { ChildViewState } from 'shared/app-state/child-view-state';
import { ReportService } from 'researcher/project/reports/report-service';
import { AppConfig } from 'app-config';
import { growlProvider } from 'shared/growl-provider';
import { CurrentUser } from 'shared/current-user';

const ProjectRoles = enums.projectRoles;
const actionBarModulePath = 'researcher/individual-activity/users/activity-users-action-bar';

export class Users {
  static inject = [
    Api,
    CurrentUser,
    DialogService,
    EventAggregator,
    ViewState,
    BindingEngine,
    ReportService,
    AppConfig,
    'store',
  ];

  constructor(
    api,
    currentUser,
    modalService,
    ea,
    viewState,
    bindingEngine,
    reportService,
    appConfig,
    store,
  ) {
    this.api = api;
    this.currentUser = currentUser;
    this.modalService = modalService;
    this.ea = ea;
    this.viewState = viewState;
    this.bindingEngine = bindingEngine;
    this.reportService = reportService;
    this.appConfig = appConfig;
    this.store = store;
  }

  selectedUsers = [];
  cardViewModels = [];
  toggleGroupsText = 'Show';

  async canActivate(params) {
    this.accountId = params.accountId;
    this.projectId = params.projectId;
    this.iaId = params.iaId;
    this.projectUsersUrl =
        `/#/accounts/${params.accountId}/projects/${params.projectId}/users`;

    await this.loadUsers();
  }

  activate() {
    this.subscriptions = [
      this.ea.subscribe('users-changed', () => {
        this._delayLoadUsers();
      }),
      this.ea.subscribe('event-users-added', () => {
        this._delayLoadUsers();
      }),
      this.bindingEngine
        .collectionObserver(this.selectedUsers)
        .subscribe(() => this.handleSelectedUsersChange()),
    ];

    this.state = new ChildViewState({
      actionBarViewModel: actionBarModulePath,
      // This is a big shortcut but I'm not sure I like it.  It works though...
      actionBarModel: this,
      sidebarViewModel: 'researcher/individual-activity/users/activity-user-menu',
      sidebarModel: this,
    });

    this.viewState.childStateStack.push(this.state);

    const domainState = this.store.getState();
    this.individualActivity = domainState.individualActivity;
  }

  deactivate() {
    if (this.usersChangedSubscription) {
      this.usersChangedSubscription.dispose();
      this.usersChangedSubscription = null;
    }
    if (this.eventUsersAddedSubscription) {
      this.eventUsersAddedSubscription.dispose();
      this.eventUsersAddedSubscription = null;
    }
    this.viewState.childStateStack.pop();
  }

  async loadUsers() {
    const query = { projectId: this.projectId, iaId: this.iaId };
    const [users, projectUsers, groupTags] = await Promise.all([
      this.api.query.eventParticipants.getForEvent(query),
      this.api.query.projectUsers.getProjectUsers(query.projectId, 3),
      this.api.query.groupTags.getGroupTags(query.projectId),
    ]);

    this.groupTags = groupTags;
    this.users = users.map(u => new UserCardModel(Object.assign(u, {
      availableGroupTags: this.groupTags,
    })));
    this.projectUsers = projectUsers;
    this.filtered = this.users.slice(0);
  }

  selectAllChecked(event) {
    this.selectedUsers.splice(0, this.selectedUsers.length);

    if (event.target.checked) {
      this.selectedUsers.splice(0, 0, ...this.filtered);
    }
  }

  handleSelectedUsersChange() {
    if (!this.selectedUsers || !this.filtered) {
      this.selectAll = false;
      return;
    }
    this.selectAll = this.selectedUsers.length === this.filtered.length &&
      this.selectedUsers.length !== 0;

    this.state.sidebarOpen = this.selectedUsers.length > 0;
  }

  selectAllLabelClick() {
    if (this.isSelectAllDisabled) {
      return;
    }
    this.selectAll = !this.selectAll;
    this.selectAllChecked({ target: { checked: this.selectAll } });
  }

  async addUsersButtonClick() {
    const projectUsers = await this.api.query.projectUsers
      .getProjectUsers(this.projectId, 3);

    const filtered = projectUsers
      .filter(pu => !this.users.find(eu => eu.userId === pu.userId));

    this.modalService.open({
      viewModel: `researcher/individual-activity/users/${filtered
        && filtered.length > 0 ? 'assign' : 'no'}-users-modal`,
      model: {
        projectId: this.projectId,
        iaId: this.iaId,
        projectUsersUrl: this.projectUsersUrl,
        projectUsers: filtered,
      },
    }).whenClosed(result => {
      if (result.wasCancelled) {
        return;
      }

      this._delayLoadUsers();
    });
  }

  async createUserButtonClick() {
    this.modalService.open({
      viewModel: 'researcher/project/users/create-project-user-modal',
      model: {
        projectId: this.projectId,
        availableGroupTags: this.groupTags,
        lockToRole: ProjectRoles.participant.int,
      },
    }).whenClosed(async modalResult => {
      if (modalResult.wasCancelled) {
        return;
      }

      const apiResult = await this.api.command.eventParticipants.addMultiple({
        projectId: this.projectId,
        eventId: this.iaId,
        userIds: modalResult.output.users.map(u => u.id),
      });

      if (apiResult.error) {
        growlProvider.error('Error', 'The user was successfully added to your project, but there was an error adding them to this event.  Click "Add from Project Users" and select the new user from there.');
        return;
      }

      this._delayLoadUsers();
    });
  }

  // Opens the Bulk Import Users modal
  importUsersButtonClick() {
    this.modalService.open({
      lock: true,
      enableEscClose: false,
      viewModel: 'shared/components/user-import/import-users-modal',
      model: {
        projectId: this.projectId,
        eventId: this.iaId,
        groupTags: this.groupTags,
        existingProjectUsers: this.projectUsers,
        existingEventUsers: this.users,
      },
    });
  }

  // Opens the create message modal
  createMessage() {
    this.modalService.open({
      viewModel: 'researcher/project/users/create-message-modal',
    });
  }

  showAllGroupTags() {
    this.cardViewModels
      .forEach(vm => vm.viewModel.currentViewModel.showGroupTags());
  }

  hideAllGroupTags() {
    this.cardViewModels
      .forEach(vm => vm.viewModel.currentViewModel.hideGroupTags());
  }

  toggleAllGroups() {
    if (this.cardViewModels
      .some(vm => !vm.viewModel.currentViewModel.isShowingTags)) {
      this.showAllGroupTags();
    } else {
      this.hideAllGroupTags();
    }
    this.updateGroupTagsToggleState();
  }

  updateGroupTagsToggleState() {
    const shouldTextReadShow = this.cardViewModels
      .some(vm => !vm.viewModel.currentViewModel.isShowingTags);

    this.toggleGroupsText = shouldTextReadShow ? 'Show' : 'Hide';
  }

  downloadParticipationReport() {
    const fileName = this._getParticipantExportFilename();
    this.reportService.downloadUserParticipation(this.projectId, this.iaId, fileName);
  }

  _getParticipantExportFilename() {
    const now = moment.tz(this.currentUser.timeZone);
    return `${this.individualActivity.privateName}-Users-${now.format('MM-DD h.mmA')}.xlsx`;
  }

  _delayLoadUsers() {
    setTimeout(() => { this.loadUsers(); }, 300);
  }

  @computedFrom('selectedUsers.length', 'filteredUsers.length')
  get isSelectAllDisabled() {
    return this.filtered.length === 0;
  }

  @computedFrom('projectUsers.length')
  get hasProjectParticipants() {
    return this.projectUsers && this.projectUsers.length > 0;
  }

  @computedFrom('users.length')
  get hasEventParticipants() {
    return this.users && this.users.length > 0;
  }
}
