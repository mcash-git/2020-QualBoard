import { bindable, bindingMode } from 'aurelia-framework';
import { LogicEngineRuleModel } from 'shared/models/logic-engine-rule-model';

export class LogicEngineRules {
  static inject = [Element];

  constructor(element) {
    this.element = element;
  }

  @bindable({ defaultBindingMode: bindingMode.oneWay }) availableGroupTags;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) availableUsers;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) rules;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) title;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) helpText;

  addRule() {
    this.rules.push(new LogicEngineRuleModel({
      memberName: 'GroupTags',
      // Defaults to ContainsAll
      operator: 11,
      availableGroupTags: this.availableGroupTags,
      availableUsers: this.availableUsers,
    }));
  }

  handleRemove(event) {
    this.rules.splice(this.rules.indexOf(event.detail), 1);
    this._signalChange();
  }

  _signalChange() {
    this.element.dispatchEvent(new CustomEvent('logic-engine-rule-change', {
      bubbles: true,
    }));
  }
}
