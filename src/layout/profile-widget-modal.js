import { DialogController } from 'aurelia-dialog';

export class ProfileWidgetModal {
  static inject = [DialogController];

  constructor(dialogController) {
    this.dialogController = dialogController;
  }

  attached() {
    this._applyModalClasses();
  }
  
  _applyModalClasses() {
    this.dialogController.renderer.dialogContainer.classList
      .add('profile-widget-modal');
  }
}
