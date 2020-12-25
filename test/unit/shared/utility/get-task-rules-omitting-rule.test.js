import { enums } from '2020-qb4';
import getTaskRulesOmittingRule from 'shared/utility/get-task-rules-omitting-rule';

const RuleOperators = enums.ruleOperators;
const coreRuleMemberName = 'ResponseOptions';

const mcmaRule = {
  operator: RuleOperators.and.int,
  rules: [{
    memberName: 'TaskResponses',
    operator: RuleOperators.containsAll.int,
    targetRules: [{
      memberName: coreRuleMemberName,
      operator: RuleOperators.containsAny.int,
      targetValue: '6f4325d3-7d20-4996-9d4f-f249aa327dfd,5102fe55-3f01-408c-8f4d-16233d64fe54',
    }],
  }, {
    memberName: 'Id',
    operator: RuleOperators.equal.int,
    targetValue: '3996fe93-272e-4d92-94de-b71cd86a8338',
  }],
};

const textRule = {
  operator: RuleOperators.and.int,
  rules: [{
    memberName: 'TaskResponses',
    operator: RuleOperators.containsAll.int,
    targetRules: [{
      memberName: coreRuleMemberName,
      operator: RuleOperators.regexMatch.int,
      targetValue: 'some text',
    }],
  }, {
    memberName: 'Id',
    operator: RuleOperators.equal.int,
    targetValue: '88f64d76-3b00-484b-973b-d747bdfec8b5',
  }],
};

describe('getTaskRulesOmittingRule()', () => {
  let omitRule;
  let ruleSet;
  let masterRule;
  let taskLogicRules;
  
  describe('rules is empty', () => {
    beforeEach(() => {
      taskLogicRules = [];
      omitRule = mcmaRule;
    });
    
    it('throws a helpful error', () => {
      expect(() => getTaskRulesOmittingRule(taskLogicRules, omitRule)).toThrow(/empty/);
    });
  });
  
  describe('rule not contained within', () => {
    beforeEach(() => {
      omitRule = mcmaRule;
      ruleSet = {
        operator: 8,
        rules: [textRule],
      };
      masterRule = {
        operator: 8,
        rules: [ruleSet],
      };
      taskLogicRules = [masterRule];
    });
    
    it('throws a helpful error', () => {
      expect(() => getTaskRulesOmittingRule(taskLogicRules, omitRule)).toThrow(/not found/);
    });
  });
  
  describe('rule found within', () => {
    describe('it is the only rule in the entire rule structure', () => {
      beforeEach(() => {
        omitRule = mcmaRule;
        ruleSet = {
          operator: 8,
          rules: [mcmaRule],
        };
        masterRule = {
          operator: 8,
          rules: [ruleSet],
        };
        taskLogicRules = [masterRule];
      });
      
      it('returns an empty array, no rules', () => {
        const result = getTaskRulesOmittingRule(taskLogicRules, omitRule);
        
        expect(result).toHaveLength(0);
      });
    });
    
    describe('it is not the only rule in the entire rule structure', () => {
      beforeEach(() => {
        omitRule = mcmaRule;
        ruleSet = {
          operator: 8,
          rules: [mcmaRule, textRule],
        };
        masterRule = {
          operator: 8,
          rules: [ruleSet],
        };
        taskLogicRules = [masterRule];
      });
  
      it('returns a new rules structure which omits the specified rule', () => {
        const result = getTaskRulesOmittingRule(taskLogicRules, omitRule);
        
        expect(result).toHaveLength(1);
        
        const resultMasterRule = result[0];
        
        expect(resultMasterRule.rules).toHaveLength(1);
        
        const resultRuleSet = resultMasterRule.rules[0];
        
        expect(resultRuleSet.rules).toHaveLength(1);
        
        const resultRemainingRule = resultRuleSet.rules[0];
        expect(resultRemainingRule).toBe(textRule);
      });
    });
  });
});
