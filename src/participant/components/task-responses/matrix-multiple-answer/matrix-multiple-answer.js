import { computedFrom } from 'aurelia-framework';
import { BindingSignaler } from 'aurelia-templating-resources';

export class ParticipantMatrixMultipleAnswer {
  static inject = [BindingSignaler];

  constructor(bs) {
    this.bs = bs;
  }

  disabledRows = [];

  activate({ task, response }) {
    this.task = task;
    this.response = response;

    this.max = this.task.maxResponseOptions || null;
    this.min = this.task.minResponseOptions || 1;

    // TODO:  Need to try setting up such that we can
    // model.bind="items[row][col]" so the object is already created and we
    // have a reference to it, instead of creating one in the binding, then
    // we can load state from localStorage and prepopulate all the answers.
  }

  @computedFrom('task.maxResponseOptions', 'task.minResponseOptions')
  get instructions() {
    if (!this.max) { // only minimum:
      return `Select at least ${this.min || 1} option${this.min === 1 ? '' : 's'
      } for each row:`;
    } else if (this.min === this.max) { // minimum and maximum are the same
      return `Select ${this.min} options for each row:`;
    }

    // Otherwise, minimum and maximum are different.
    return `Select ${this.min} to ${this.max} options for each row:`;
  }

  handleChange(row, col) {
    this.signalStyleChange(row, col);

    this.updateDisabledStateForRow(row);
  }

  signalStyleChange(row, col) {
    this.bs.signal(`selection-changed:${col.columnId}${row.rowId}`);
  }

  updateDisabledStateForRow(row) {
    const selectedInRow = this.response.matrixResponses.filter(opt =>
      opt.rowId === row.rowId);

    if (selectedInRow.length >= (this.task.maxResponseOptions || this.task.matrixColumns.length)) {
      this.disabledRows.push(row.rowId);
    } else {
      this.disabledRows = this.disabledRows.filter(item => item !== row.rowId);
    }
    this.bs.signal(`selection-changed:${row.rowId}`);
  }

  isChecked(item) {
    return this.response.matrixResponses
      .find(i => i.rowId === item.rowId && i.columnId === item.columnId);
  }

  isDisabled(row, col) {
    return this.disabledRows.find(r => r === row.rowId) &&
      !this.response.matrixResponses.find(opt =>
        opt.rowId === row.rowId && opt.columnId === col.columnId);
  }
}
