import { bindable, bindingMode, computedFrom } from 'aurelia-framework';
import { BindingSignaler } from 'aurelia-templating-resources';

export class ParticipantMatrixMultipleAnswer {
  static inject = [BindingSignaler];

  constructor(bs) {
    this.bs = bs;
  }

  disabledRows = [];
  @bindable({ defaultBindingMode: bindingMode.oneWay })
  task;

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  taskResponse;

  activate(model) {
    this.task = model.task;
    this.taskResponse = model.taskResponse;

    // TODO:  Need to try setting up such that we can
    // model.bind="items[row][col]" so the object is already created and we
    // have a reference to it, instead of creating one in the binding, then
    // we can load state from localStorage and prepopulate all the answers.
  }

  @computedFrom('task.maximumOptionsLimit', 'task.minimumOptionsRequired')
  get instructions() {
    // always have a minimum and maximum explicit.
    const max = this.task.maximumOptionsLimit;
    const min = this.task.minimumOptionsRequired || 1;

    // TODO:  This language will need to be changed and sound better
    if (!max) { // only minimum:
      return `Select at least ${min || 1} option${min === 1 ? '' : 's'
      } for each row:`;
    } else if (min === max) { // minimum and maximum are the same
      return `Select ${min} options for each row:`;
    }

    // Otherwise, minimum and maximum are different.
    return `Select ${min} to ${max} options for each row:`;
  }

  handleChange(row, col) {
    this.signalStyleChange(row, col);

    this.updateDisabledStateForRow(row);
  }

  signalStyleChange(row, col) {
    this.bs.signal(`selection-changed:${col.columnId}${row.rowId}`);
  }

  updateDisabledStateForRow(row) {
    const selectedInRow = this.taskResponse.matrixResponses.filter(opt =>
      opt.rowId === row.rowId);

    if (selectedInRow.length >= (this.task.maximumOptionsLimit || this.task.matrixColumns.length)) {
      this.disabledRows.push(row.rowId);
    } else {
      this.disabledRows = this.disabledRows.filter(item => item !== row.rowId);
    }
    this.bs.signal(`selection-changed:${row.rowId}`);
  }

  isChecked(item) {
    return this.taskResponse.matrixResponses
      .find(i => i.rowId === item.rowId && i.columnId === item.columnId);
  }

  isDisabled(row, col) {
    return this.disabledRows.find(r => r === row.rowId) &&
      !this.taskResponse.matrixResponses.find(opt =>
        opt.rowId === row.rowId && opt.columnId === col.columnId);
  }
}
