import { LogicRuleSetModel } from 'shared/components/logic-builder/logic-rule-set-model';
import { enums } from '2020-qb4';
import users from './test-users.json';
import tags from './test-tags.json';
import tasks from './test-tasks.json';

const RuleOperators = enums.ruleOperators;
const availableItems = { participants: users, groupTags: tags, tasks };
const mockRuleDto = {};
const clonedRule = {};
const mockRule = {
  isEmpty: false,
  toDto: () => mockRuleDto,
  clone: () => clonedRule,
};

describe('LogicRuleSetModel', () => {
  describe('fromDto()', () => {
    describe('with invalid DTO', () => {
      it('throws error', () => {
        const dto = {
          memberName: 'UserId',
          operator: 8,
          rules: [{
            memberName: 'UserId',
            operator: 1,
            targetValue: '812c4918-88e5-4eb1-9fa8-1eda84f03fd0',
          }, {
            memberName: 'UserId',
            operator: 1,
            targetValue: '6bd918c1-b5f7-4a4f-6b5f-08d41f672922',
          }],
        };

        expect(() => LogicRuleSetModel.fromDto(dto, availableItems)).toThrow(/memberName/);
      });
    });

    it('returns a populated model', () => {
      const dto = {
        operator: 8,
        rules: [{
          memberName: 'UserId',
          operator: 8,
          rules: [{
            memberName: 'UserId',
            operator: 1,
            targetValue: '812c4918-88e5-4eb1-9fa8-1eda84f03fd0',
          }, {
            memberName: 'UserId',
            operator: 1,
            targetValue: '6bd918c1-b5f7-4a4f-6b5f-08d41f672922',
          }],
        }],
      };

      const model = LogicRuleSetModel.fromDto(dto, availableItems);

      expect(model).toBeDefined();
      expect(model.rules).toHaveLength(1);
    });
  });

  describe('toDto()', () => {
    describe('when it is empty', () => {
      it('throws an error', () => {
        const model = new LogicRuleSetModel();

        expect(() => model.toDto()).toThrow(/empty/);
      });
    });

    describe('when it is not empty', () => {
      it('returns a valid DTO with rules array', () => {
        const model = new LogicRuleSetModel();
        const operator = RuleOperators.and;

        model.rules.push(mockRule);
        model.operator = operator;

        const dto = model.toDto();

        expect(dto.memberName).toBeUndefined();
        expect(dto.rules).toHaveLength(1);
        expect(dto.rules[0]).toBe(mockRuleDto);
        expect(dto.operator).toBe(operator.int);
      });
    });

    describe('when it contains empty rules', () => {
      it('removes the empty rules', () => {
        const model = new LogicRuleSetModel();
        const emptyRule = {
          isEmpty: true,
        };
        model.rules.push(emptyRule);
        model.rules.push(mockRule);

        const dto = model.toDto();

        expect(dto.rules).toHaveLength(1);
        expect(dto.rules[0]).toBe(mockRuleDto);
      });
    });
  });

  describe('clone()', () => {
    it('returns model populated with cloned rules', () => {
      const model = new LogicRuleSetModel({
        rules: [mockRule],
        operator: LogicRuleSetModel.allowedOperators[0],
      });

      const clone = model.clone();

      expect(clone.operator).toEqual(model.operator);
      expect(clone.rules).toHaveLength(1);
      expect(clone.rules[0]).toBe(clonedRule);
    });
  });

  describe('get isEmpty()', () => {
    describe('when rules is empty', () => {
      it('returns true', () => {
        const model = new LogicRuleSetModel();

        expect(model.isEmpty).toBe(true);
      });
    });

    describe('when rules contains only empty rules', () => {
      it('returns true', () => {
        const model = new LogicRuleSetModel();
        const emptyRule1 = {
          isEmpty: true,
        };
        const emptyRule2 = {
          isEmpty: true,
        };
        model.rules.push(emptyRule1);
        model.rules.push(emptyRule2);

        expect(model.isEmpty).toBe(true);
      });
    });

    describe('when rules contains at least one non-empty rule', () => {
      it('returns false', () => {
        const model = new LogicRuleSetModel();
        const emptyRule1 = {
          isEmpty: true,
        };
        const emptyRule2 = {
          isEmpty: true,
        };

        model.rules.push(emptyRule1);
        model.rules.push(emptyRule2);
        model.rules.push(mockRule);

        expect(model.isEmpty).toBe(false);
      });
    });
  });
});
