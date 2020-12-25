
export class ParticipantMultipleChoiceCompleted {
  activate(model) {
    this.task = model.task;
    this.taskResponse = model.taskResponse;

    this.selectedOptions = this.taskResponse.responseOptions.map(optId =>
      this.task.options.find(o => o.optionId === optId));
  }
}
