import { DialogController } from 'aurelia-dialog';

export class MatrixTagModal {
  static inject = [DialogController];

  constructor(modalController) {
    this.modalController = modalController;
  }

  activate(model) {
    this.cellGroupTags = model.cellGroupTags;
    this.task = model.task;
    this.availableGroupTags = model.task.availableGroupTags;

    this.editGroupTags = this.cellGroupTags.groupTagObjects.concat();

    this.header = `Group Tags for ${this.task.matrixRows
      .find(r => r.rowId === this.cellGroupTags.rowId).text}: ${this.task
      .matrixColumns
      .find(r => r.columnId === this.cellGroupTags.columnId).text}`;
  }

  apply() {
    this.cellGroupTags.groupTagObjects = this.editGroupTags;
    this.modalController.ok();
  }
}
