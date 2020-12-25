import { enums } from '2020-qb4';
import { computedFrom } from 'aurelia-framework';
import { LogicRuleModel } from './logic-rule-model';

const RuleOperators = enums.ruleOperators;

export class LogicRuleSetModel {
  constructor({
    rules = [],
    operator = LogicRuleSetModel.allowedOperators[0],
  } = {}) {
    validate();
    
    this.rules = rules;
    this.operator = operator;
    
    function validate() {
      if (operator && !LogicRuleSetModel.allowedOperators.find(op => op.int === operator.int)) {
        throw new Error(`operator was not valid: ${JSON.stringify(operator)}`);
      }
    }
  }
  
  static allowedOperators = [RuleOperators.and, RuleOperators.or];
  
  static fromDto(dto, availableItems) {
    validate();

    return new LogicRuleSetModel({
      operator: RuleOperators[dto.operator],
      rules: dto.rules.map(r => LogicRuleModel.fromDto(r, availableItems)),
    });
    
    function validate() {
      if (!LogicRuleSetModel.allowedOperators.includes(RuleOperators[dto.operator])) {
        throw new Error('Unable to initialize via fromDto() - operator is not valid.');
      }
      
      if (dto.memberName) {
        throw new Error('Unable to initialize via fromDto() - memberName should be empty.');
      }
    }
  }
  
  toDto() {
    if (this.isEmpty) {
      throw new Error('Unable to call toDto() on empty rule-set.  Remove empty rule-sets before' +
        'calling toDto()');
    }
    
    return {
      operator: this.operator.int,
      rules: this.rules.filter(r => !r.isEmpty).map(r => r.toDto()),
    };
  }
  
  clone() {
    return new LogicRuleSetModel({
      rules: this.rules.map(r => r.clone()),
      operator: this.operator,
    });
  }
  
  @computedFrom('rules.length')
  get isEmpty() {
    return this.rules.filter(r => !r.isEmpty).length === 0;
  }
}
