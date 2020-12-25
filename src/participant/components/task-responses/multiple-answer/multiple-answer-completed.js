export class ParticipantMultipleAnswerCompleted {
  activate({ task, response }) {
    this.task = task;
    this.response = response;
  }
}
