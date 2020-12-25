import { BindingEngine, bindable, bindingMode } from 'aurelia-framework';
import { enums } from '2020-qb4';

const RuleOperators = enums.ruleOperators;

export class LogicEngineRuleUsers {
  static inject = [Element, BindingEngine];

  constructor(element, bindingEngine) {
    this.element = element;
    this.bindingEngine = bindingEngine;
    this.ruleOperators = [
      RuleOperators.or,
      RuleOperators.and,
    ];
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) rule;

  activate(model) {
    this.rule = model.rule;
  }

  signalChange() {
    this.element.dispatchEvent(new CustomEvent('logic-engine-rule-change', {
      bubbles: true,
    }));
  }
}

export class UserIdLogicEngineRuleOperatorValueConverter {
  toView(operator) {
    return operator === RuleOperators.or ?
      'Any' :
      'None';
  }
}
