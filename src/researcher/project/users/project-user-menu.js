import { BindingEngine } from 'aurelia-binding';
import { DialogService } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { CurrentUser } from 'shared/current-user';
import { growlProvider } from 'shared/growl-provider';
import { IdentityClient } from '2020-identity';
import { Api } from 'api/api';
import { enums } from '2020-qb4';

export class ProjectUserMenu {
  static inject = [
    DialogService,
    CurrentUser,
    Api,
    IdentityClient,
    EventAggregator,
    BindingEngine,
  ];

  constructor(modalService, user, api, identityClient, ea, bindingEngine) {
    this.modalService = modalService;
    this.user = user;
    this.api = api;
    this.identityClient = identityClient;
    this.ea = ea;
    this.bindingEngine = bindingEngine;

    this.shouldShowRemoveButton = user.isSuperUser;
    this.roles = enums.projectRoles;
  }

  groupTagsToApply = [];

  activate(model) {
    this.model = model;
  }

  bind() {
    this.subscription = this.bindingEngine.collectionObserver(this.model.selectedUsers)
      .subscribe(() => this._setCalculatedProperties());
  }

  detached() {
    if (this.subscription) {
      this.subscription.dispose();
    }
  }

  //  Opens the create message modal
  openCreateMessageModal() {
    this.modalService.open({
      viewModel: 'researcher/project/users/create-message-modal',
      model: {
        users: this.model.selectedUsers,
        projectId: this.model.projectId,
        accountId: this.model.accountId,
        allUsers: this.model.filtered,
      },
    });
  }

  handleDeactivateClick() {
    this.modalService.open({
      viewModel: 'shared/components/confirmation-modal',
      model: {
        text: 'Deactivating will block further user access to the project but leave participation data in place.',
        title: 'Deactivate: Are you sure?',
        confirmButtonClass: 'btn-warning',
        confirmButtonText: 'Deactivate',
        cancelButtonClass: 'btn-outline-secondary',
      },
    }).whenClosed(async result => {
      if (result.wasCancelled) {
        return;
      }

      const userIds = this.model.selectedUsers.filter(u => u.isActive)
        .map(u => u.userId);

      try {
        await this.identityClient.deactivateProjectUsers({
          userIds,
          projectId: this.model.projectId,
        });

        this.model.selectedUsers.forEach(u => {
          u.isActive = false;
        });
        this._updateState();
      } catch (e) {
        console.error('Encountered an error attempting to deactivate project users:', e);
        growlProvider.warning('Error', 'There was an error deactivating one or more users.  Please try again.');
      }
    });
  }

  handleActivateClick() {
    this.modalService.open({
      viewModel: 'shared/components/confirmation-modal',
      model: {
        text: 'Activating any users who are currently deactivated will allow them to participate in this project again.',
        title: 'Activate: Are you sure?',
        confirmButtonClass: 'btn-success',
        confirmButtonText: 'Activate',
        cancelButtonClass: 'btn-outline-secondary',
      },
    }).whenClosed(async result => {
      if (result.wasCancelled) {
        return;
      }

      const userIds = this.model.selectedUsers.filter(u => !u.isActive)
        .map(u => u.userId);

      try {
        await this.identityClient.activateProjectUsers({
          userIds,
          projectId: this.model.projectId,
        });

        this.model.selectedUsers.forEach(u => {
          u.isActive = true;
        });
        this._updateState();
      } catch (e) {
        console.error('Encountered an error attempting to activate project users:', e);
        growlProvider.warning('Error', 'There was an error activating one or more users.  Please try again.');
      }
    });
  }

  handleRemoveClick() {
    this.modalService.open({
      viewModel: 'shared/components/confirmation-modal',
      model: {
        text: 'Blocks further user access to the project AND removes all participation data.',
        title: 'Delete: Are you sure?',
        confirmButtonClass: 'btn-danger',
        confirmButtonText: 'Delete',
        cancelButtonClass: 'btn-outline-secondary',
      },
    }).whenClosed(async result => {
      if (result.wasCancelled) {
        return;
      }

      const userIds = this.model.selectedUsers.map(u => u.userId);

      try {
        await this.identityClient.deleteProjectUsers({
          userIds,
          projectId: this.model.projectId,
        });
        this.ea.publish('users-changed');
      } catch (e) {
        console.error('Encountered an error attempting to delete project users:', e);
        growlProvider.warning('Error', 'There was an error deleting one or more users.  Please try again.');
      }
    });
  }

  async changeRole() {
    if (!this.changeToRole) {
      return;
    }

    this.modalService.open({
      viewModel: 'shared/components/confirmation-modal',
      model: {
        title: 'Are you sure?',
        text: `You are about to change the selected users to ${
          this.changeToRole.friendly}.  This will change their access level.`,
      },
    }).whenClosed(async modalResult => {
      if (modalResult.wasCancelled) {
        return;
      }

      try {
        await this.identityClient.setProjectUsersRoles({
          projectId: this.model.projectId,
          usersRoles: this.model.selectedUsers.map(u => ({
            userId: u.userId,
            role: this.changeToRole.int,
          })),
        });
        this.ea.publish('users-changed');
      } catch (e) {
        console.error('Encountered an error attempting to change users\' roles:', e);
        growlProvider.warning('Error', 'There was an error changing user role.  Please try again.');
      }
    });
  }

  async applyGroupTags() {
    const newTags = this.groupTagsToApply.filter(t => !t.id);
    const result = await this.api.command.groupTags.batchCreate({
      projectId: this.model.projectId,
      newTags,
    });

    if (result.error) {
      growlProvider.warning('Error', 'There was an error saving the new group tags.  Please try again.  If the problem persists, please contact support.');
      return;
    }

    try {
      await this.identityClient.addTagsToUsers({
        projectId: this.model.projectId,
        groupTagIds: this.groupTagsToApply.map(t => t.id),
        userIds: this.model.selectedUsers.filter(u => u.role === 3).map(u => u.userId || u.id),
      });
    } catch (e) {
      console.error('There was an error applying the group tags to the participants:', e);
      growlProvider.warning('Error', 'There was an error applying the group tags to the participants.  Please try again.  If the problem persists, please contact support.');
      return;
    }

    this.groupTagsToApply.forEach(t => {
      this.model.selectedUsers.filter(u => u.role === 3).forEach(u => {
        if (!u.groupTags.find(ut => ut.id === t.id)) {
          u.groupTags.push(t);
        }
        if (!u.editGroupTags.find(ut => ut.id === t.id)) {
          u.editGroupTags.push(t);
        }
      });
    });

    this.groupTagsToApply = [];
  }

  // triggers a view update
  _updateState() {
    this.model.selectedUsers
      .splice(0, this.model.selectedUsers.length, ...this.model.selectedUsers);
  }

  _setCalculatedProperties() {
    const users = this.model.selectedUsers;

    this.allowGroupTags = users.filter(user => user.role !== 3).length === 0;
    this.shouldShowDeactivateButton = users.filter(u => u.isActive).length > 0;
    this.shouldShowActivateButton = users.filter(u => !u.isActive).length > 0;
    this.shouldShowDisplayNameSection = users.length === 1;
  }
}
