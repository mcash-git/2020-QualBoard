export class ParticipantMatrixMultipleAnswerCompleted {
  activate({ task, response }) {
    this.task = task;
    this.response = response;

    this.selectedOptions = this.response.matrixResponses;
  }

  checkedItemMatcher(a, b) {
    return a.columnId === b.columnId && a.rowId === b.rowId;
  }

  isChecked(item) {
    return this.response.matrixResponses.find(i =>
      i.rowId === item.rowId && i.columnId === item.columnId);
  }
}
