import { computedFrom, bindable, bindingMode } from 'aurelia-framework';
import { enums } from '2020-qb4';

const PromptTypes = enums.promptTypes;

export class SavedMatrix {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) task;

  activate(model) {
    this.task = model.task;
  }

  @computedFrom('task')
  get inputType() {
    return isMatrixMultipleChoice(this.task.type) ? 'radio' : 'checkbox';
  }

  @computedFrom('task', 'task.type', 'task.maximumOptionsLimit', 'task.minimumOptionsRequired')
  get instructions() {
    const max = this.task.maximumOptionsLimit;

    // always have a minimum
    const min = this.task.minimumOptionsRequired || 1;

    // TODO:  This language will need to be changed and sound better

    let inst;

    if (isMatrixMultipleChoice(this.task.type)) {
      inst = 'Select 1';
    } else if (!max) { // only minimum:
      inst = `Select at least ${min || 1} option${min === 1 || !min ? '' : 's'}`;
    } else if (min === max) { // minimum and maximum are the same
      inst = `Select ${min} options`;
    } else { // minimum and maximum are different.
      inst = `Select ${min} to ${max} options`;
    }
    return `${inst} for each row:`;
  }
}

function isMatrixMultipleChoice(type) {
  return PromptTypes[type].value.match(/choice/i);
}
