import { MasterLogicRuleSetModel }
  from 'shared/components/logic-builder/master-logic-rule-set-model';
import users from './test-users.json';
import tags from './test-tags.json';
import tasks from './test-tasks.json';

const availableItems = { participants: users, groupTags: tags, tasks };

const usersDto = {
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

const tagsDto = {
  memberName: 'GroupTags',
  operator: 11,
  targetValue: 'e0e95fa5-9423-42d4-b075-574c9ce952ad,437ef08d-2c8a-4025-b599-b05c97e211b4',
};

const ruleSetDto = {
  operator: 8,
  rules: [usersDto, tagsDto],
};

const masterRuleSetDto = {
  operator: 8,
  rules: [ruleSetDto],
};

const clonedRuleSetModel = {
  isEmpty: false,
  toDto: () => ruleSetDto,
};

const mockRuleSetModel = {
  isEmpty: false,
  toDto: () => ruleSetDto,
  clone: () => clonedRuleSetModel,
};

const emptyRuleSetModel = {
  isEmpty: true,
  toDto: () => null,
};

describe('MasterLogicRuleSetModel', () => {
  describe('fromDto()', () => {
    describe('with invalid DTOs', () => {
      it('throws error when given a users rule DTO', () => {
        expect(() => MasterLogicRuleSetModel.fromDto(usersDto, availableItems))
          .toThrow(/invalid/);
      });

      it('throws error when given a ruleSet rule DTO', () => {
        expect(() => MasterLogicRuleSetModel.fromDto(ruleSetDto, availableItems))
          .toThrow(/invalid/);
      });

      it('throws error when availableItems is not provided', () => {
        expect(() => MasterLogicRuleSetModel.fromDto(masterRuleSetDto)).toThrow(/available/);
      });
    });

    describe('with valid DTOs', () => {
      it('populates the deep model', () => {
        const model = MasterLogicRuleSetModel.fromDto(masterRuleSetDto, availableItems);

        expect(model).toBeDefined();
        expect(model.operator.int).toBe(masterRuleSetDto.operator);
        expect(model.ruleSets).toHaveLength(1);

        const ruleSetModel = model.ruleSets[0];

        expect(ruleSetModel.rules).toHaveLength(2);

        const usersRuleModel = ruleSetModel.rules[0];
        const tagsRuleModel = ruleSetModel.rules[1];

        expect(usersRuleModel).toBeDefined();
        expect(tagsRuleModel).toBeDefined();
      });
    });
  });

  describe('toDto()', () => {
    describe('when empty', () => {
      it('throws an error', () => {
        const model = new MasterLogicRuleSetModel();

        expect(() => model.toDto()).toThrow(/empty/);
      });
    });

    describe('when it contains an empty rule set', () => {
      it('removes the empty rule set', () => {
        const model = new MasterLogicRuleSetModel({
          ruleSets: [emptyRuleSetModel, mockRuleSetModel],
        });

        const dto = model.toDto();

        expect(dto.memberName).toBeUndefined();
        expect(dto.rules).toHaveLength(1);
        expect(dto.rules[0]).toBe(ruleSetDto);
      });
    });

    describe('when not empty', () => {
      it('returns a DTO by calling toDto() on each ruleSet', () => {
        const model = new MasterLogicRuleSetModel({
          ruleSets: [mockRuleSetModel],
          operator: MasterLogicRuleSetModel.allowedOperators[1],
        });

        const dto = model.toDto();

        expect(dto.memberName).toBeUndefined();
        expect(dto.operator).toBe(9);
        expect(dto.rules).toHaveLength(1);
        expect(dto.rules[0]).toBe(ruleSetDto);
      });
    });
  });

  describe('clone()', () => {
    it('returns clones of its ruleSets', () => {
      const model = new MasterLogicRuleSetModel({
        ruleSets: [mockRuleSetModel],
        operator: MasterLogicRuleSetModel.allowedOperators[1],
      });

      const clone = model.clone();

      expect(clone.operator).toEqual(model.operator);
      expect(clone.ruleSets).toHaveLength(1);
      expect(clone.ruleSets[0]).toBe(clonedRuleSetModel);
    });
  });

  describe('get isEmpty()', () => {
    describe('when ruleSets is empty', () => {
      it('returns true', () => {
        const model = new MasterLogicRuleSetModel();

        expect(model.isEmpty).toBe(true);
      });
    });

    describe('when ruleSets contains only empty ruleSets', () => {
      it('returns true', () => {
        const model = new MasterLogicRuleSetModel({
          ruleSets: [emptyRuleSetModel],
        });

        expect(model.isEmpty).toBe(true);
      });
    });

    describe('when ruleSets contains at least one non-empty item', () => {
      it('returns false', () => {
        const model = new MasterLogicRuleSetModel({
          ruleSets: [emptyRuleSetModel, mockRuleSetModel],
        });

        expect(model.isEmpty).toBe(false);
      });
    });
  });
});
