import { bindable, bindingMode } from 'aurelia-framework';

export class ParticipantMatrixMultipleAnswerCompleted {
  @bindable({ defaultBindingMode: bindingMode.oneWay })
  task;

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  taskResponse;

  activate(model) {
    this.task = model.task;
    this.taskResponse = model.taskResponse;

    this.selectedOptions = this.taskResponse.matrixResponses;
  }

  checkedItemMatcher(a, b) {
    return a.columnId === b.columnId && a.rowId === b.rowId;
  }

  isChecked(item) {
    return this.taskResponse.matrixResponses.find(i =>
      i.rowId === item.rowId && i.columnId === item.columnId);
  }
}
