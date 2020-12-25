import { computedFrom } from 'aurelia-framework';
import { enums } from '2020-qb4';
import { LogicRuleSubjectOperator } from './logic-rule-subject-operator';
import { LogicRuleSubjectModel } from './logic-rule-subject-model';

const RuleOperators = enums.ruleOperators;
const name = 'User';
const memberName = 'UserId';
const module = 'shared/components/logic-builder/subjects/users-logic-rule-subject';
const allowedOperators = [
  new LogicRuleSubjectOperator({
    subRuleOperator: RuleOperators.equal,
    ruleOperator: RuleOperators.or,
    friendly: 'is one of',
  }),
  new LogicRuleSubjectOperator({
    subRuleOperator: RuleOperators.notEqual,
    ruleOperator: RuleOperators.and,
    friendly: 'is not one of',
  }),
];

export class UsersLogicRuleSubjectModel extends LogicRuleSubjectModel {
  constructor({
    availableUsers = null,
    users = [],
    operator = null,
  } = {}) {
    validate();
    
    super({
      name, module, allowedOperators, operator,
    });
    
    this.availableUsers = availableUsers;
    this.users = users;
    this.operator = operator || allowedOperators[0];
    
    function validate() {
      if (!availableUsers) {
        throw new Error('You must supply the array of available users');
      }
    }
  }
  
  static allowedOperators = allowedOperators;
  
  static fromDto(dto, availableUsers) {
    validate();

    return new UsersLogicRuleSubjectModel({
      availableUsers,
      users: dto.rules
        .map(r => availableUsers.find(u => u.userId === r.targetValue))
        .filter(r => r),
      operator: allowedOperators.find(o => o.ruleOperator.int === dto.operator),
    });
    
    function validate() {
      if (dto.memberName !== 'UserId') {
        throw new Error('dto.memberName must be "UserId" for UsersLogicRuleSubjectModel.fromDto()');
      }
    }
  }
  
  toDto() {
    if (this.isEmpty) {
      throw new Error('Cannot call toDto() on an empty rule subject - remove empty items' +
        'before transforming into DTOs.');
    }
    return {
      memberName,
      operator: this.operator.ruleOperator.int,
      rules: this.users.map(u => ({
        memberName,
        operator: this.operator.subRuleOperator.int,
        targetValue: u.userId,
      })),
    };
  }
  
  clone() {
    return new UsersLogicRuleSubjectModel({
      availableUsers: this.availableUsers,
      users: this.users.concat(),
      operator: this.operator,
    });
  }
  
  @computedFrom('users.length')
  get isEmpty() {
    return this.users.length === 0;
  }
}
