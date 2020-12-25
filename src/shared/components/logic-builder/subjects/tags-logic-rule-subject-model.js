import { computedFrom } from 'aurelia-framework';
import { enums } from '2020-qb4';
import { LogicRuleSubjectOperator } from './logic-rule-subject-operator';
import { LogicRuleSubjectModel } from './logic-rule-subject-model';

const RuleOperators = enums.ruleOperators;
const name = 'User\'s group tags';
const module = 'shared/components/logic-builder/subjects/tags-logic-rule-subject';
const allowedOperators = [
  new LogicRuleSubjectOperator({
    ruleOperator: RuleOperators.containsAny,
    friendly: 'has any',
  }),
  new LogicRuleSubjectOperator({
    ruleOperator: RuleOperators.containsAll,
    friendly: 'has all',
  }),
  new LogicRuleSubjectOperator({
    ruleOperator: RuleOperators.containsNone,
    friendly: 'has none',
  }),
];
const memberName = 'GroupTags';

export class TagsLogicRuleSubjectModel extends LogicRuleSubjectModel {
  constructor({
    availableGroupTags = null,
    groupTags = [],
    operator = TagsLogicRuleSubjectModel.allowedOperators[0],
  } = {}) {
    validate();
    
    super({
      name, module, allowedOperators, operator,
    });
    this.availableGroupTags = availableGroupTags;
    this.groupTags = groupTags;
    
    function validate() {
      if (!availableGroupTags) {
        throw new Error('You must supply the array of available group tags');
      }
    }
  }
  
  static allowedOperators = allowedOperators;
  
  static fromDto(dto, availableGroupTags) {
    validate();
    
    return new TagsLogicRuleSubjectModel({
      availableGroupTags,
      groupTags: dto.targetValue
        .split(',')
        .map(id => availableGroupTags.find(t => t.id === id))
        .filter(t => t),
      operator: allowedOperators.find(o => o.ruleOperator.int === dto.operator),
    });
    
    function validate() {
      if (dto.memberName !== memberName) {
        throw new Error('dto.memberName must be "GroupTags" for ' +
          'TagsLogicRuleSubjectModel.fromDto()');
      }
    }
  }
  
  toDto() {
    if (this.isEmpty) {
      throw new Error('Cannot call toDto() on empty TagsLogicRuleSubjectModel.  Remove empty ' +
        'rules before calling toDto()');
    }
  
    if (this.groupTags.filter(t => !t.id).length > 0) {
      throw new Error('Cannot call toDto() when there are new, unsaved tasks in the collection.' +
        'Save all new tasks before attempting to transform to DTO.');
    }
    
    return {
      memberName,
      operator: this.operator.ruleOperator.int,
      targetValue: this.groupTags.map(t => t.id).join(','),
    };
  }
  
  clone() {
    return new TagsLogicRuleSubjectModel({
      availableGroupTags: this.availableGroupTags,
      groupTags: this.groupTags.concat(),
      operator: this.operator,
    });
  }
  
  @computedFrom('groupTags.length')
  get isEmpty() {
    return this.groupTags.length === 0;
  }
}
