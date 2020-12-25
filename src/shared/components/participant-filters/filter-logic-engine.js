import { bindable, bindingMode } from 'aurelia-framework';

export class FilterLogicEngine {
  static inject = [Element];
  
  constructor(element) {
    this.element = element;
  }
  
  @bindable({ defaultBindingMode: bindingMode.oneWay }) rules;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) participants;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) availableGroupTags;
  
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  expandedSessionStorageKey;
  
  signalChange() {
    this.element.dispatchEvent(new CustomEvent('logic-engine-rules-changed', {
      bubbles: true,
    }));
  }
}
