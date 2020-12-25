import { customElement, bindable } from 'aurelia-framework';

@customElement('project-user-card-client')
export class ProjectUserCardClient {
  @bindable user;

  activate(model) {
    this.user = model.user;
  }
}
