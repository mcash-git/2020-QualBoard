import { MediaClient } from '2020-media';
import { DialogController } from 'aurelia-dialog';
import { CurrentUser } from 'shared/current-user';

export class DownloadMediaModal {
  static inject = [MediaClient, DialogController, CurrentUser];

  constructor(mediaClient, dialogController, currentUser) {
    this.mediaClient = mediaClient;
    this.modalController = dialogController;
    this.currentUser = currentUser;
  }

  canActivate(model) {
    return model.assets && model.assets.length > 0;
  }

  activate({
    title = '',
    body = '',
    placeholderText = '',
    defaultValue = '',
  }) {
    this.title = title;
    this.body = body;
    this.placeholderText = placeholderText;
    this.userInput = defaultValue;
  }

  attached() {
    this.inputElement.select();
  }

  async okButtonClick() {
    this.modalController.ok(this.userInput);
  }

  keydown(event) {
    if (event.keyCode === 13) {
      this.okButtonClick();
      return false;
    }

    return true;
  }

  cancelButtonClick() {
    this.modalController.cancel();
  }
}
