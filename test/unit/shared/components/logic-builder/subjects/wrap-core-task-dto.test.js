import { enums } from '2020-qb4';
import { wrapCoreTaskDto } from 'shared/components/logic-builder/subjects/wrap-core-task-dto';

const RuleOperators = enums.ruleOperators;
const mockTask = { id: 'frig' };
const mockDto = {};

describe('wrapCoreTaskDto()', () => {
  describe('when not given a task', () => {
    it('throws an error', () => {
      expect(() => wrapCoreTaskDto(mockDto)).toThrow(/task/);
    });
  });
  
  it('wraps the given DTO in a valid taskLogicRule', () => {
    const wrapped = wrapCoreTaskDto(mockDto, mockTask);
    
    expect(wrapped).toBeDefined();
    expect(wrapped.memberName).toBeUndefined();
    expect(wrapped.operator).toBe(RuleOperators.and.int);
    expect(wrapped.rules).toHaveLength(2);
    
    const taskIdRule = wrapped.rules[0];
    
    expect(taskIdRule.memberName).toBe('Id');
    expect(taskIdRule.targetValue).toBe(mockTask.id);
    expect(taskIdRule.operator).toBe(RuleOperators.equal.int);
    
    const taskResponseRule = wrapped.rules[1];
    
    expect(taskResponseRule.memberName).toBe('TaskResponses');
    expect(taskResponseRule.operator).toBe(RuleOperators.containsAll.int);
    expect(taskResponseRule.targetRules).toHaveLength(1);
    expect(taskResponseRule.targetRules[0]).toBe(mockDto);
  });
});
