import { bindable, bindingMode, computedFrom } from 'aurelia-framework';
import { enums } from '2020-qb4';

const PromptTypes = enums.promptTypes;

export class ActivityTask {
  static inject = [Element];

  constructor(element) {
    this.element = element;
  }

  showResponses = false;

  @bindable({ defaultBindingMode: bindingMode.twoWay }) task;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) projectId;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) expandTo;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) moderatorId;

  attached() {
    if (this.expandTo) {
      this.toggleResponses();
    }
  }

  toggleResponses() {
    if (this.task.type !== 1) {
      this.showResponses = !this.showResponses;
    }
  }

  @computedFrom('task.type')
  get iconClass() {
    return PromptTypes[this.task.type].icon;
  }

  @computedFrom('task.type')
  get taskClass() {
    return PromptTypes[this.task.type].value === 'Notice' ? 'notice' : '';
  }

  stopProp(e) {
    e.stopPropagation();
  }
}
