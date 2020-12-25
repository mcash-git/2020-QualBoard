import { Api } from 'api/api';

export class GroupsSidebar {
  static inject = [Api] ;

  constructor(api) {
    this.api = api;
  }

  activate(model) {
    this.model = model;
    this.tag = this.model.tag;
  }

  close() {
    this.model.react.closeSidebar();
  }

  removeParticipant(participant) {
    this.model.react.removeParticipantFromGroupTag(this.tag, participant);
  }
}
