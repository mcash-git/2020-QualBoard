import { UsersLogicRuleSubjectModel }
  from 'shared/components/logic-builder/subjects/users-logic-rule-subject-model';
import users from '../test-users.json';

const operators = UsersLogicRuleSubjectModel.allowedOperators;
const memberName = 'UserId';

describe('UsersLogicRuleSubjectModel', () => {
  describe('constructor', () => {
    it('throws an error when not passed an array of availableUsers', () => {
      expect(() => new UsersLogicRuleSubjectModel()).toThrow(/available users/);
    });

    it('defaults to operator "is one of"', () => {
      const instance = new UsersLogicRuleSubjectModel({ availableUsers: users });

      expect(instance.operator).toBe(operators[0]);
    });
  });

  describe('toDto()', () => {
    let subject;
    const firstTwoUsers = users.slice(0, 2);

    beforeEach(() => {
      subject = new UsersLogicRuleSubjectModel({
        availableUsers: users,
        users: firstTwoUsers,
        operator: operators[0],
      });
    });

    it('throws an error when called while empty', () => {
      const model = new UsersLogicRuleSubjectModel({
        availableUsers: users,
      });

      expect(() => model.toDto()).toThrow(/empty/);
    });

    it('"is one of" generates appropriate DTO structure', () => {
      const dto = subject.toDto();

      expect(dto.memberName).toBe(memberName);
      expect(dto.operator).toBe(operators[0].ruleOperator.int);
      expect(dto.rules).toHaveLength(firstTwoUsers.length);

      const firstRule = dto.rules[0];

      expect(firstRule).toBeDefined();
      expect(firstRule.memberName).toBe(memberName);
      expect(firstRule.operator).toBe(operators[0].subRuleOperator.int);
      expect(firstRule.targetValue).toBe(firstTwoUsers[0].userId);

      const secondRule = dto.rules[1];

      expect(secondRule).toBeDefined();
      expect(secondRule.memberName).toBe(memberName);
      expect(secondRule.operator).toBe(operators[0].subRuleOperator.int);
      expect(secondRule.targetValue).toBe(firstTwoUsers[1].userId);
    });

    it('"is not one of" generates appropriate DTO structure', () => {
      subject.operator = operators[1];
      const dto = subject.toDto();

      expect(dto.memberName).toBe(memberName);
      expect(dto.operator).toBe(operators[1].ruleOperator.int);
      expect(dto.rules).toHaveLength(firstTwoUsers.length);

      const firstRule = dto.rules[0];

      expect(firstRule).toBeDefined();
      expect(firstRule.memberName).toBe(memberName);
      expect(firstRule.operator).toBe(operators[1].subRuleOperator.int);
      expect(firstRule.targetValue).toBe(firstTwoUsers[0].userId);

      const secondRule = dto.rules[1];

      expect(secondRule).toBeDefined();
      expect(secondRule.memberName).toBe(memberName);
      expect(secondRule.operator).toBe(operators[1].subRuleOperator.int);
      expect(secondRule.targetValue).toBe(firstTwoUsers[1].userId);
    });
  });

  describe('fromDto()', () => {
    describe('with invalid DTO', () => {
      it('throws error', () => {
        const dto = {
          memberName: 'GroupTags',
          operator: 11,
          targetValue: 'e0e95fa5-9423-42d4-b075-574c9ce952ad,437ef08d-2c8a-4025-b599-b05c97e211b4',
        };

        expect(() => UsersLogicRuleSubjectModel.fromDto(dto, users)).toThrow(/"UserId"/);
      });
    });

    describe('with valid DTO', () => {
      it('"is not one of" populates correctly', () => {
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

        const model = UsersLogicRuleSubjectModel.fromDto(dto, users);

        expect(model).toBeDefined();
        expect(model.operator).toBe(operators[1]);
        expect(model.users).toHaveLength(2);
        expect(users).toEqual(expect.arrayContaining(model.users));
      });
    });

    describe('with invalid DTO', () => {
      const dto = {
        memberName: 'GroupTags',
        operator: 11,
        targetValue: 'e0e95fa5-9423-42d4-b075-574c9ce952ad,437ef08d-2c8a-4025-b599-b05c97e211b4',
      };

      expect(() => UsersLogicRuleSubjectModel.fromDto(dto, users)).toThrow(/"UserId"/);
    });
  });

  describe('clone()', () => {
    it('returns identical model', () => {
      const model = new UsersLogicRuleSubjectModel({
        availableUsers: users,
        users: [users[0], users[1]],
      });

      const clone = model.clone();

      expect(clone.availableUsers).toBe(model.availableUsers);
      expect(clone.users).toHaveLength(2);
      expect(clone.users).not.toBe(model.users);
      expect(clone.users).toEqual(expect.arrayContaining(model.users));
    });
  });

  describe('get isEmpty()', () => {
    it('returns false when it contains at least one user', () => {
      const model = new UsersLogicRuleSubjectModel({
        availableUsers: users,
        users: [users[0]],
      });

      expect(model.isEmpty).toBe(false);
    });

    it('returns true when it contains no users', () => {
      const model = new UsersLogicRuleSubjectModel({
        availableUsers: users,
      });

      expect(model.isEmpty).toBe(true);
    });
  });
});
