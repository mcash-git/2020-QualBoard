import { bindable, bindingMode } from 'aurelia-framework';

export class InsertRow {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) task;

  static inject = [Element];

  constructor(element) {
    this.element = element;
  }

  addTask() {
    this.element.dispatchEvent(new CustomEvent('insert-after', {
      bubbles: true,
      detail: { task: this.task },
    }));
  }
}
