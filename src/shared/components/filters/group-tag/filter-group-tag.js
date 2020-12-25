import { bindable, bindingMode } from 'aurelia-framework';

export class FilterGroupTag {
  static inject = [Element];

  constructor(element) {
    this.element = element;
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) availableTags;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) chosenTags;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) title;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) subHeader;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) mode;

  changedTag() {
    this.element.dispatchEvent(new CustomEvent('group-tag-filter-changed', {
      bubbles: true,
    }));
  }
}
