
export class ParticipantMatrixMultipleChoiceCompleted {
  activate({ task, response }) {
    this.task = task;
    this.response = response;
    this.selectedOptions = {};

    this.response.matrixResponses.forEach(({ rowId, columnId }) => {
      this.selectedOptions[rowId] = columnId;
    });
  }
}
