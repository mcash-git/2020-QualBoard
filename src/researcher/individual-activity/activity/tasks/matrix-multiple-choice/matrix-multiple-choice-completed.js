
export class ParticipantMatrixMultipleChoiceCompleted {
  activate(model) {
    this.task = model.task;
    this.taskResponse = model.taskResponse;
    this.selectedOptions = {};

    this.taskResponse.matrixResponses.forEach(({ rowId, columnId }) => {
      this.selectedOptions[rowId] = columnId;
    });
  }
}
