import { bindable, computedFrom } from 'aurelia-framework';
import { LogicRuleModel } from './logic-rule-model';
import { LogicRuleSetModel } from './logic-rule-set-model';

export class LogicRuleSet {
  static inject = [Element];
  
  constructor(element) {
    this.element = element;
    this.allowedOperators = LogicRuleSetModel.allowedOperators;
  }
  
  @bindable ruleSet;
  @bindable subjectGroupFactory;
  
  remove() {
    this.element.dispatchEvent(new CustomEvent('remove-rule-set', {
      bubbles: true,
      detail: {
        ruleSet: this.ruleSet,
      },
    }));
  }
  
  addRule() {
    this.ruleSet.rules.push(new LogicRuleModel());
  }
  
  removeRuleByIndex(index) {
    this.ruleSet.rules.splice(index, 1);
  }
  
  @computedFrom('ruleSet.operator')
  get operatorClass() {
    return this.ruleSet.operator.value.toLowerCase();
  }
}
