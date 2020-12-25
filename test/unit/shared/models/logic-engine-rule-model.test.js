import { LogicEngineRuleModel } from 'shared/models/logic-engine-rule-model';
import { enums } from '2020-qb4';

const RuleOperators = enums.ruleOperators;

describe('LogicEngineRuleModel', () => {
  describe('get isEmpty()', () => {
    it('returns true when memberName is "GroupTags" and groupTags is ' +
      'empty', () => {
      const model = new LogicEngineRuleModel({
        memberName: 'GroupTags',
        operator: RuleOperators.containsAny.int,
        targetValue: '',
        targetRules: [],
        rules: [],
        
        // not on back end object properties:
        groupTags: [],
        users: [],
        availableGroupTags: [],
        availableUsers: [],
      });
      
      expect(model.isEmpty).toBe(true);
    });
    
    it('returns false when memberName is "GroupTags" and groupTags is ' +
      'not empty', () => {
      const model = new LogicEngineRuleModel({
        memberName: 'GroupTags',
        operator: RuleOperators.containsAny.int,
        targetValue: '',
        targetRules: [],
        rules: [],
        
        // not on back end object properties:
        groupTags: [{ id: '1', name: '21+' }],
        users: [],
        availableGroupTags: [],
        availableUsers: [],
      });
      
      expect(model.isEmpty).toBe(false);
    });
  });
});
