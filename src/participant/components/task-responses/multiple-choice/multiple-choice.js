import { observable } from 'aurelia-framework';

export class ParticipantMultipleChoice {
  @observable selectedOption;

  activate({ task, response }) {
    this.task = task;
    this.response = response;
  }
  
  selectedOptionChanged(option) {
    this.response.responseOptions = [option];
  }
}
