import { DialogController } from 'aurelia-dialog';
import { Api } from 'api/api';

export class AssignUsersModal {
  static inject = [Api, DialogController];

  constructor(api, modalController) {
    this.api = api;
    this.modalController = modalController;
  }

  activate(model) {
    this.projectUsersUrl = model.projectUsersUrl;
  }

  linkClick() {
    this.modalController.close();
    return true;
  }
}
