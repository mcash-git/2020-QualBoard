import { computedFrom } from 'aurelia-framework';

export class EventBuilderActionBar {
  activate(model) {
    this.model = model;
  }
  
  @computedFrom('model.canEditTasks', 'model.editState.taskBeingEdited')
  get shouldShowButtons() {
    return this.model.canEditTasks && !this.model.editState.taskBeingEdited;
  }
}
