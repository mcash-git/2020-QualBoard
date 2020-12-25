import { DialogController } from 'aurelia-dialog';

export class StringPromptModal {
  static inject = [DialogController];
  
  constructor(dialogController) {
    this.dialogController = dialogController;
  }

  activate(model) {
    this.promptText = model.promptText;
    this.title = model.title;
  }

  cancel() {
    this.dialogController.cancel();
  }

  ok() {
    this.dialogController.ok(this.value);
  }
  
  handleKeyup(e) {
    if (e.keyCode === 13 && this.value.trim() !== '') {
      this.ok();
    }
  }
}
