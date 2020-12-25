import { customElement, bindable } from 'aurelia-framework';

@customElement('project-user-card-analyst')
export class ProjectUserCardAnalyst {
  @bindable user;

  activate(model) {
    this.user = model.user;
  }
}
