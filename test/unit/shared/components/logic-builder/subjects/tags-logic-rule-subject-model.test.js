import { TagsLogicRuleSubjectModel }
  from 'shared/components/logic-builder/subjects/tags-logic-rule-subject-model';
import tags from '../test-tags.json';

const operators = TagsLogicRuleSubjectModel.allowedOperators;
const memberName = 'GroupTags';

describe('TagsLogicRuleSubjectModel', () => {
  describe('constructor', () => {
    it('throws an error when not passed an array of availableGroupTags', () => {
      expect(() => new TagsLogicRuleSubjectModel()).toThrow(/available group tags/);
    });

    it('defaults to operator "has any"', () => {
      const instance = new TagsLogicRuleSubjectModel({ availableGroupTags: tags });

      expect(instance.operator).toBe(operators[0]);
    });
  });

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

        expect(() => TagsLogicRuleSubjectModel.fromDto(dto, tags)).toThrow(/"GroupTags"/);
      });
    });

    describe('with valid DTO', () => {
      it('"contains all" populates correctly', () => {
        const dto = {
          memberName: 'GroupTags',
          operator: 11,
          targetValue: 'e0e95fa5-9423-42d4-b075-574c9ce952ad,437ef08d-2c8a-4025-b599-b05c97e211b4',
        };

        const model = TagsLogicRuleSubjectModel.fromDto(dto, tags);

        expect(model).toBeDefined();
        expect(model.operator).toBe(operators[1]);
        expect(model.groupTags).toHaveLength(2);
        expect(tags).toEqual(expect.arrayContaining(model.groupTags));
      });
    });
  });

  describe('toDto()', () => {
    let subject;
    const firstTwoTags = tags.slice(0, 2);

    beforeEach(() => {
      subject = new TagsLogicRuleSubjectModel({
        availableGroupTags: tags,
        groupTags: firstTwoTags.concat(),
        operator: operators[0],
      });
    });

    describe('when empty', () => {
      it('throws an error', () => {
        const model = new TagsLogicRuleSubjectModel({
          availableGroupTags: tags,
        });

        expect(() => model.toDto()).toThrow(/empty/);
      });
    });

    describe('when a group tag has not yet been saved', () => {
      it('throws an error', () => {
        subject.groupTags.push({
          id: null,
          projectId: '50338a64-e2c8-4055-bbeb-859f88cacfec',
          name: 'Heavy Smoker',
          color: null,
        });

        expect(() => subject.toDto()).toThrow(/unsaved/);
      });
    });

    describe('operator is "contains any"', () => {
      it('generates appropriate DTO structure', () => {
        const dto = subject.toDto();

        expect(dto.memberName).toBe(memberName);
        expect(dto.operator).toBe(operators[0].ruleOperator.int);
        expect(dto.targetValue).toEqual(expect.stringContaining(firstTwoTags[0].id));
        expect(dto.targetValue).toEqual(expect.stringContaining(firstTwoTags[1].id));
      });
    });

    describe('operator is "contains all"', () => {
      it('generates appropriate DTO structure', () => {
        subject.operator = operators[1];
        const dto = subject.toDto();

        expect(dto.memberName).toBe(memberName);
        expect(dto.operator).toBe(operators[1].ruleOperator.int);
        expect(dto.targetValue).toEqual(expect.stringContaining(firstTwoTags[0].id));
        expect(dto.targetValue).toEqual(expect.stringContaining(firstTwoTags[1].id));
      });
    });
  });

  describe('clone()', () => {
    it('returns identical model', () => {
      const model = new TagsLogicRuleSubjectModel({
        availableGroupTags: tags,
        groupTags: [tags[0], tags[1]],
      });

      const clone = model.clone();

      expect(clone.availableGroupTags).toBe(model.availableGroupTags);
      expect(clone.groupTags).toHaveLength(2);
      expect(clone.groupTags).not.toBe(model.groupTags);
      expect(clone.groupTags).toEqual(expect.arrayContaining(model.groupTags));
    });
  });

  describe('get isEmpty()', () => {
    it('returns false when it contains at least one tag', () => {
      const model = new TagsLogicRuleSubjectModel({
        availableGroupTags: tags,
        groupTags: [tags[0]],
      });

      expect(model.isEmpty).toBe(false);
    });

    it('returns true when it contains no tags', () => {
      const model = new TagsLogicRuleSubjectModel({
        availableGroupTags: tags,
      });

      expect(model.isEmpty).toBe(true);
    });
  });
});
