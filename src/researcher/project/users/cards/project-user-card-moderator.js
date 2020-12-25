import { customElement, bindable } from 'aurelia-framework';

@customElement('project-user-card-moderator')
export class ProjectUserCardModerator {
  @bindable user;

  activate(model) {
    this.user = model.user;
  }
}
