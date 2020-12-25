import { computedFrom, bindable, bindingMode } from 'aurelia-framework';
import { enums } from '2020-qb4';

const PromptTypes = enums.promptTypes;

export class SavedMcma {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) task;

  activate(model) {
    this.task = model.task;
  }

  @computedFrom('task')
  get inputType() {
    return isMultipleChoice(this.task.type) ? 'radio' : 'checkbox';
  }

  @computedFrom('task', 'task.type', 'task.maximumOptionsLimit', 'task.minimumOptionsRequired')
  get instructions() {
    const max = this.task.maximumOptionsLimit;

    // always have a minimum
    const min = this.task.minimumOptionsRequired || 1;

    // TODO:  This language will need to be changed and sound better

    if (isMultipleChoice(this.task.type)) {
      return 'Select 1 option:';
    } else if (!max) { // only minimum:
      return `Select at least ${min || 1} option${min === 1 || !min ? '' : 's'}:`;
    } else if (min === max) { // minimum and maximum are the same
      return `Select ${min} options:`;
    } // minimum and maximum are different.
    return `Select ${min} to ${max} options:`;
  }
}

function isMultipleChoice(type) {
  return PromptTypes[type].value.match(/choice/i);
}
