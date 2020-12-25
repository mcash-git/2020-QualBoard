import { computedFrom } from 'aurelia-framework';

export class EventBuilderSidebar {
  activate(model) {
    this.model = model;
  }
  
  @computedFrom('model.editState.taskBeingEdited')
  get task() {
    return this.model.editState.taskBeingEdited;
  }
  
  @computedFrom('taskLogicSummaryViewModel.ruleCount', 'userLogicSummaryViewModel.ruleCount')
  get shouldShowConditionalConnector() {
    return this.taskLogicSummaryViewModel.ruleCount > 0 &&
      this.userLogicSummaryViewModel.ruleCount > 0;
  }
}

