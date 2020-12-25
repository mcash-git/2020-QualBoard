import { bindable, bindingMode } from 'aurelia-framework';

export class EditButtons {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) task;

  static inject = [Element];

  constructor(element) {
    this.element = element;
  }
}
