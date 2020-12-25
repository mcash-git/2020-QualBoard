export class ParticipantMatrixMultipleChoice {
  selectedOptions = {};

  activate({ task, response }) {
    this.task = task;
    this.response = response;

    this.selectedOptions = {};
  }

  setupSelectedOptions(rows) {
    rows.forEach(row => {
      this.selectedOptions[row.rowId] = null;
    });
  }

  handleChange() {
    this.response.matrixResponses = Object.values(this.selectedOptions)
      .filter(item => item !== null && item !== undefined);
  }
}
