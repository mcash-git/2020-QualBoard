import { bindable, bindingMode } from 'aurelia-framework';

const availableMembers = [
  { value: 'GroupTags', friendly: 'Group Tags' },
  { value: 'UserId', friendly: 'Users' },
];

export class LogicEngineRule {
  static inject = [Element];

  constructor(element) {
    this.element = element;
    this.availableMembers = availableMembers;
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) rule;

  handleRemoveClick() {
    this.element.dispatchEvent(new CustomEvent('remove-logic-engine-rule', {
      bubbles: true,
      detail: this.rule,
    }));
  }
}
