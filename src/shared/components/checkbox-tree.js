import { bindable, observable, TaskQueue } from 'aurelia-framework';

export class CheckboxTree {
  static inject = [Element, TaskQueue];

  constructor(element, taskQueue) {
    this.element = element;
    this.taskQueue = taskQueue;
  }

  @bindable model;
  @bindable checked;

  @observable isChecked;
  viewModelChildren = [];

  bind() {
    // ignore the -Changed() methods on first bind (this is empty but needed)
  }

  attached() {
    // when initializing, we should check children state and set accordingly
    this.checkedChanged();
  }

  // `checked` is an array of the values selected, this is when that ref changes
  checkedChanged() {
    if (this.isParent && this.model.children.length > 0) {
      this.handleLeafChange();
    }
  }

  isCheckedChanged(isChecked) {
    if (this.ignoreChange) {
      return;
    }

    this.viewModelChildren.forEach(child => {
      if (child.isParent) {
        child.isChecked = isChecked;
        child.checkboxElement.indeterminate = false;
        return;
      }

      const index = this.checked.indexOf(child.model.value);
      if (isChecked && index === -1) {
        this.checked.push(child.model.value);
      } else if (!isChecked && index !== -1) {
        this.checked.splice(index, 1);
      }
    });

    this.leafChange();
  }

  handleLeafChange() {
    this.ignoreChange = true;

    // This task will fire after (if) the isCheckedChanged handler is invoked.
    this.taskQueue.queueTask(() => {
      this.ignoreChange = false;
    });

    let uncheckedCount = 0;
    let checkedCount = 0;
    const { leafValues } = this.model;

    for (let i = 0; i < leafValues.length; i++) {
      const leafValue = leafValues[i];
      const index = this.checked.indexOf(leafValue);
      if (index === -1) {
        uncheckedCount++;
      } else {
        checkedCount++;
      }
      if (uncheckedCount > 0 && checkedCount > 0) {
        this.isChecked = false;
        this.checkboxElement.indeterminate = true;
        return;
      }
    }

    this.checkboxElement.indeterminate = false;
    this.isChecked = uncheckedCount === 0;
  }

  leafChange() {
    this.element.dispatchEvent(new CustomEvent('leaf-change', {
      bubbles: true,
    }));
  }

  toggleExpanded() {
    this.model.isExpanded = !this.model.isExpanded;
  }

  get isParent() {
    return this.model.isParent;
  }
}
