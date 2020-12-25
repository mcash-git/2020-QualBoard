import { bindable, bindingMode, computedFrom } from 'aurelia-framework';
import { enums } from '2020-qb4';

const PromptTypes = enums.promptTypes;

export class TaskOptions {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) task;

  constructor() {
    this.types = PromptTypes;
  }

  changeType(t) {
    if (!this.task.canEdit) {
      return;
    }

    this.task.type = PromptTypes.indexOf(t);
  }
  
  @computedFrom('task', 'task.type')
  get selectedHtml() {
    if (!this.task || this.task.type === undefined) {
      return '';
    }

    return `<i class="btn-icon ${PromptTypes[this.task.type].icon}"></i>${
      PromptTypes[this.task.type].friendly}`;
  }

  @computedFrom('task', 'task.type')
  get showRequireMedia() {
    if (this.task.type === undefined) {
      return false;
    }

    const typeValue = PromptTypes[this.task.type].value;
    return typeValue !== 'Notice';
  }

  @computedFrom('task', 'task.type')
  get showRequireComment() {
    if (this.task.type === undefined) {
      return false;
    }
    const typeValue = PromptTypes[this.task.type].value;
    return typeValue !== 'Text' && typeValue !== 'Notice';
  }

  @computedFrom('task', 'task.type')
  get showAutoWrapOptions() {
    if (this.task.type === undefined) {
      return false;
    }
    const typeValue = PromptTypes[this.task.type].value;
    return typeValue === 'MultipleChoice' || typeValue === 'MultipleAnswer';
  }

  @computedFrom('task', 'task.type')
  get showMinMax() {
    if (this.task.type === undefined) {
      return false;
    }
    const typeValue = PromptTypes[this.task.type].value;
    return typeValue === 'MatrixMultipleAnswer' ||
      typeValue === 'MultipleAnswer';
  }
}
