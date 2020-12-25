import { BindingEngine, computedFrom } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { growlProvider } from 'shared/growl-provider';
import { Api } from 'api/api';
import { IdentityClient } from '2020-identity';
import { enums } from '2020-qb4';
import { UserCardModel } from 'researcher/project/users/user-card-model';
import { ViewState } from 'shared/app-state/view-state';
import { ChildViewState } from 'shared/app-state/child-view-state';
import { CurrentUser } from 'shared/current-user';

const ProjectRoles = enums.projectRoles;
const actionBarModulePath = 'researcher/project/users/project-users-action-bar';

export class ProjectUsers {
  static inject = [
    Api,
    IdentityClient,
    DialogService,
    EventAggregator,
    ViewState,
    BindingEngine,
    CurrentUser,
  ];

  constructor(api, identityClient, modalService, ea, viewState, bindingEngine, user) {
    this.api = api;
    this.identityClient = identityClient;
    this.projectRoles = ProjectRoles.sortedForDisplay;
    this.modalService = modalService;
    this.ea = ea;
    this.viewState = viewState;
    this.bindingEngine = bindingEngine;
    this.user = user;
  }

  selectedRole;
  projectUsersByRole = {};
  cardViewModels = [];
  filtered = [];
  toggleGroupsText = 'Show';
  selectedUsers = [];

  async canActivate(params) {
    this.accountId = params.accountId;
    this.projectId = params.projectId;
    /* eslint-disable */
    const [undef, myProjectUser] = await Promise.all([
      this.selectTab(ProjectRoles.participant),
      this.identityClient.getMyProjectUser(this.projectId),
    ]);
    /* eslint-enable */
    this.myProjectUser = myProjectUser;
  }

  activate() {
    this.subscriptions = [
      this.ea.subscribe('users-changed', () => {
        this.selectTab(this.selectedRole);
      }),
      this.ea.subscribe('project-users-imported', () => {
        setTimeout(() => {
          this.selectTab(this.selectedRole);
        }, 300);
      }),
      this.bindingEngine
        .collectionObserver(this.selectedUsers)
        .subscribe(() => this.handleSelectedUsersChange()),
    ];

    this.state = new ChildViewState({
      actionBarViewModel: actionBarModulePath,
      // This is a big shortcut but I'm not sure I like it.  It works though...
      actionBarModel: this,
      sidebarViewModel: 'researcher/project/users/project-user-menu',
      sidebarModel: this,
    });

    this.viewState.childStateStack.push(this.state);
  }

  canDeactivate() {
    return !this.isImportDialogOpen;
  }

  deactivate() {
    this.subscriptions.forEach(s => s.dispose());
    this.subscriptions = [];
    this.viewState.childStateStack.pop();
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

  async selectTab(role) {
    const [projectUsers, groupTags] = await Promise.all([
      this.api.query.projectUsers.getProjectUsers(this.projectId),
      this.api.query.groupTags.getGroupTags(this.projectId),
    ]);
    this.groupTags = groupTags;
    this.projectUsers = projectUsers
      .map(u => new UserCardModel(Object.assign(u, {
        availableGroupTags: this.groupTags,
      })));

    this.selectedRole = role;
    this.filtered = role ?
      this.projectUsers.filter(u => u.role === role.int) :
      this.projectUsers;

    this.selectAll = false;
    this.selectedUsers.splice(0, this.selectedUsers.length);
  }

  async getGroupTags() {
    const { groupTags } = await this.api.query.groupTags
      .getGroupTagsAndParticipants(this.projectId);
    this.groupTags = groupTags;
  }

  selectAllChecked(event) {
    this.selectedUsers.splice(0, this.selectedUsers.length);

    if (event.target.checked) {
      this.selectedUsers.splice(0, 0, ...this.filtered);
    }
  }

  selectAllLabelClick() {
    if (this.isSelectAllDisabled) {
      return;
    }
    this.selectAll = !this.selectAll;
    this.selectAllChecked({ target: { checked: this.selectAll } });
  }

  async addUserButtonClick() {
    this.modalService.open({
      viewModel: 'researcher/project/users/create-project-user-modal',
      model: {
        projectId: this.projectId,
        availableGroupTags: this.groupTags,
      },
    }).whenClosed(result => {
      if (result.wasCancelled) {
        return;
      }

      setTimeout(() => this.selectTab(this.selectedRole), 200);
    });
  }

  showAllGroupTags() {
    this.cards
      .forEach(vm => {
        if (vm.viewModel.currentViewModel.showGroupTags) {
          vm.viewModel.currentViewModel.showGroupTags();
        }
      });
  }

  hideAllGroupTags() {
    this.cards
      .forEach(vm => {
        if (vm.viewModel.currentViewModel.hideGroupTags) {
          vm.viewModel.currentViewModel.hideGroupTags();
        }
      });
  }

  toggleAllGroups() {
    if (this.isToggleAllGroupsDisabled) {
      return;
    }
    if (this.cards
      .some(vm => vm.viewModel.currentViewModel.isParticipant &&
          !vm.viewModel.currentViewModel.isShowingTags)) {
      this.showAllGroupTags();
    } else {
      this.hideAllGroupTags();
    }
    this.updateGroupTagsToggleState();
  }

  updateGroupTagsToggleState() {
    const shouldTextReadShow = this.cards
      .some(vm => vm.viewModel.currentViewModel.isParticipant &&
        !vm.viewModel.currentViewModel.isShowingTags);

    this.toggleGroupsText = shouldTextReadShow ? 'Show' : 'Hide';
  }

  async importUsersButtonClick() {
    // Keeping the modal open promise on this view-model allows us to stop
    // back navigation in the view-model
    this.isImportDialogOpen = true;
    this.modalService.open({
      lock: true,
      enableEscClose: false,
      viewModel: 'shared/components/user-import/import-users-modal',
      model: {
        projectId: this.projectId,
        existingProjectUsers: this.projectUsers,
        groupTags: this.groupTags,
      },
    }).whenClosed(() => {
      this.isImportDialogOpen = false;
    });
  }

  async addSelfAsModerator() {
    this.modalService.open({
      viewModel: 'shared/components/string-prompt-modal',
      model: {
        promptText: 'Enter the desired display-name for your project-user:',
        title: 'Add Yourself as a Moderator',
      },
    }).whenClosed(async modalResult => {
      if (modalResult.wasCancelled) {
        return;
      }

      const createCommand = {
        projectId: this.projectId,
        email: this.user.email,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        userProject: {
          projectId: this.projectId,
          role: 0,
          displayName: modalResult.output,
        },
        customRedirectClientUrl: window.location.origin,
        emailOption: 'DoNotSend',
      };
      try {
        await this.identityClient.createProjectUsers(createCommand);
      } catch (e) {
        console.error('There was an error saving your user:', e);
      }

      growlProvider.success('User Successfully Added', `Your user "${modalResult.output}" was successfully added to the project.`);

      setTimeout(async () => {
        this.myProjectUser = await this.identityClient.getMyProjectUser(this.projectId);
        this.selectTab(ProjectRoles.moderator);
      }, 300);
    });
  }

  @computedFrom('selectedUsers.length', 'filtered.length')
  get isSelectAllDisabled() {
    return this.filtered.length === 0;
  }

  @computedFrom('filtered.length', 'selectedRole')
  get isToggleAllGroupsDisabled() {
    if (this.filtered.length === 0) {
      return true;
    }

    return this.selectedRole !== null &&
      this.selectedRole !== ProjectRoles.participant;
  }

  get cards() {
    return this.cardViewModels.filter(m => m);
  }
}
