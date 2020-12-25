import { enums } from '2020-qb4';

const RuleOperators = enums.ruleOperators;

export function validateAndUnwrapCoreTaskRuleDto(dto, tasks) {
  if (!dto) {
    throw new Error('You must supply a DTO to validate and unwrap.');
  }
  if (!tasks) {
    throw new Error('You must supply the task to validate the DTO');
  }
  if (!dto.rules) {
    throw new Error('DTO is not a valid TaskRule DTO (no rules array)');
  }
  
  const idRule = dto.rules.find(r => r.memberName === 'Id');
  
  if (!idRule) {
    throw new Error('DTO did not contain the memberName: "Id" rule.');
  }

  if (RuleOperators[idRule.operator] !== RuleOperators.equal) {
    throw new Error(`"Id" rule operator should be "Equal" (0) but was ${idRule.operator}`);
  }
  
  const task = tasks.find(t => t.id === idRule.targetValue);
  
  if (!task) {
    throw new Error('"Id" rule targetValue did not match any of the tasks provided."');
  }
  
  const responseRule = dto.rules.find(r => r.memberName === 'TaskResponses');
  
  if (!responseRule) {
    throw new Error('DTO did not contain the memberName: "TaskResponses" rule.');
  }
  
  if (RuleOperators[responseRule.operator] !== RuleOperators.containsAll) {
    throw new Error(`"TaskResponses" rule operator should be "ContainsAll" (11) but was ${
      responseRule.operator}`);
  }
  
  return { coreRule: responseRule.targetRules[0], task };
}
