import { DialogController } from 'aurelia-dialog';

export class ConfirmationModal {
  static inject = [DialogController];
  constructor(dialogController) {
    this.modalController = dialogController;
  }

  activate(model) {
    this.title = model.title;
    this.text = model.text;
    this.confirmButtonText = model.confirmButtonText || 'Ok';
    this.cancelButtonText = model.cancelButtonText || 'Cancel';
    this.confirmButtonClass = model.confirmButtonClass || 'btn-primary';
    this.cancelButtonClass = model.cancelButtonClass || 'btn-secondary';
    // TODO:  Add support for module/view-model compose or HTML raw?
  }

  cancel() {
    this.modalController.cancel();
  }

  ok() {
    this.modalController.ok();
  }
}
