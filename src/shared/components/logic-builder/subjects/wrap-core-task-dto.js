import { enums } from '2020-qb4';

const RuleOperators = enums.ruleOperators;

export function wrapCoreTaskDto(dto, task) {
  if (!task) {
    throw new Error('You must supply the task that this rule targets.');
  }
  
  return {
    operator: RuleOperators.and.int,
    rules: [{
      memberName: 'Id',
      operator: RuleOperators.equal.int,
      targetValue: task.id,
    }, {
      memberName: 'TaskResponses',
      operator: RuleOperators.containsAll.int,
      targetRules: [dto],
    }],
  };
}
