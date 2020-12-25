import { bindable, bindingMode } from 'aurelia-framework';

export class SavedButtons {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) task;

  static inject = [Element];

  constructor(element) {
    this.element = element;
  }

  dispatchEvent(eventName, clickEvent) {
    clickEvent.stopPropagation();
    this.element.dispatchEvent(new CustomEvent(eventName, {
      bubbles: true,
      detail: { task: this.task },
    }));
  }
}
