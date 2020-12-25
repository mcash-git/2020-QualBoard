import { Api } from 'api/api';
import { growlProvider } from 'shared/growl-provider';
import { DialogController } from 'aurelia-dialog';

export class AssignUsersModal {
  static inject = [Api, DialogController];

  constructor(api, modalController) {
    this.api = api;
    this.modalController = modalController;
  }

  attached() {
    this._applyModalClasses();
  }

  selectedUsers = [];

  activate(model) {
    this.iaId = model.iaId;
    this.projectId = model.projectId;
    this.projectUsersUrl = model.projectUsersUrl;
    this.projectUsers = model.projectUsers;
  }

  selectAllChecked() {

  }

  selectAllLabelClick() {
    if (this.selectAll) {
      this.selectedUsers = [];
      this.selectAll = false;
      return;
    }

    this.selectAll = true;
    this.selectedUsers = this.projectUsers.concat();
  }

  submit() {
    const selectedIds = this.selectedUsers.map(u => u.userId);
    if (selectedIds.length === 0) {
      return this.modalController.ok();
    }
    return this.api.command.eventParticipants.addMultiple({
      projectId: this.projectId,
      eventId: this.iaId,
      userIds: selectedIds,
    }).then(response => {
      if (response.error) {
        growlProvider.warning('Error', 'There was an error adding the users.  Please try again.');
        return;
      }

      this.modalController.ok();
    });
  }

  userClick(event, user) {
    if (event.target.matches('.custom-control-input') || event.target.matches('input')) {
      return;
    }

    user.selected = !user.selected;
  }

  _applyModalClasses() {
    this.modalController.renderer.dialogContainer.classList
      .add('full-screen-modal');
    this.modalController.renderer.dialogOverlay.classList
      .add('full-screen-modal');
  }
}
