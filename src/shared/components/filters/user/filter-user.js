import { bindable, bindingMode } from 'aurelia-framework';

export class FilterUser {
  static inject = [Element];

  constructor(element) {
    this.element = element;
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) availableUsers;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) chosenUsers;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) title;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) subHeader;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) mode;

  changedUser() {
    this.element.dispatchEvent(new CustomEvent('users-filter-changed', {
      bubbles: true,
    }));
  }
}
