export class ParticipantMatrixMultipleChoice {
  selectedOptions = {};

  activate(model) {
    this.task = model.task;
    this.taskResponse = model.taskResponse;

    this.selectedOptions = {};
  }

  setupSelectedOptions(rows) {
    rows.forEach(row => {
      this.selectedOptions[row.rowId] = null;
    });
  }

  handleChange() {
    this.taskResponse.matrixResponses = Object.values(this.selectedOptions)
      .filter(item => item !== null && item !== undefined);
  }
}
