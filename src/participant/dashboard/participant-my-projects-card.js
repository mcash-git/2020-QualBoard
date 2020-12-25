import { customElement, bindable } from 'aurelia-framework';
import { CurrentUser } from 'shared/current-user';

@customElement()
export class ParticipantMyProjectsCard {
  @bindable project;

  static inject = [CurrentUser];
  constructor(currentUser) {
    this.currentUser = currentUser;
  }

  handleCardClick() {
    location.href = `/#/participant/projects/${this.project.id}/users/${
      this.project.userId}/dashboard`;
  }
}
