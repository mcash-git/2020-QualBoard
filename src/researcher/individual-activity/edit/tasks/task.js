import { bindable, bindingMode } from 'aurelia-framework';

export class Task {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) task;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) editingTask;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) availableGroupTags;

  static inject = [Element];

  constructor(element) {
    this.element = element;
  }

  edit(e) {
    if (e.target.closest('#media-container') || e.target.closest('#media-slider')) {
      return;
    }

    this.element.dispatchEvent(new CustomEvent('edit', {
      bubbles: true,
      detail: { task: this.task },
    }));
  }
}
