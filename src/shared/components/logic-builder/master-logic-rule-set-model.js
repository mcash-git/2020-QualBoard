import { enums } from '2020-qb4';
import { LogicRuleSetModel } from './logic-rule-set-model';

const RuleOperators = enums.ruleOperators;

// master - each task will only have ONE LogicRuleMasterSetModel for its projectUsersLogicRules and
// ONE for its taskLogicRules.  Each contains one or more LogicRuleSetModels, which each contain one
// or more LogicRuleModels.
export class MasterLogicRuleSetModel {
  constructor({
    ruleSets = [],
    operator = RuleOperators.and,
  } = {}) {
    this.ruleSets = ruleSets;
    this.operator = operator;
  }
  
  static allowedOperators = [RuleOperators.and, RuleOperators.or];
  
  static fromDto(dto, availableItems) {
    validate();
    
    return new MasterLogicRuleSetModel({
      operator: RuleOperators[dto.operator],
      ruleSets: dto.rules.map(r => LogicRuleSetModel.fromDto(r, availableItems)),
    });
    
    function validate() {
      if (!isMasterRuleSet(dto)) {
        throw new Error('Unable to initialize via fromDto() - invalid master rule set structure.');
      }
      
      if (!MasterLogicRuleSetModel.allowedOperators.includes(RuleOperators[dto.operator])) {
        throw new Error('Unable to initialize via fromDto() - operator is not valid.');
      }
      
      if (!availableItems) {
        throw new Error('Unable to initialize via fromDto() - must provide available items.');
      }
    }
  }
  
  toDto() {
    if (this.isEmpty) {
      throw new Error('Unable to call toDto() on empty MasterLogicRuleSetModel.');
    }
    
    return {
      operator: this.operator.int,
      rules: this.ruleSets.filter(r => !r.isEmpty).map(r => r.toDto()),
    };
  }
  
  clone() {
    return new MasterLogicRuleSetModel({
      ruleSets: this.ruleSets.map(rs => rs.clone()),
      operator: this.operator,
    });
  }
  
  // we don't use @computedFrom here, because we are not binding to `isEmpty`, and even if we were
  // we can't simply observe ruleSets.length since we have to check each ruleSet's `isEmpty` prop
  get isEmpty() {
    return this.ruleSets.filter(r => !r.isEmpty).length === 0;
  }
}

function isMasterRuleSet(dto) {
  return !dto.memberName && dto.rules && dto.rules.every(r => !r.memberName && r.rules);
}
