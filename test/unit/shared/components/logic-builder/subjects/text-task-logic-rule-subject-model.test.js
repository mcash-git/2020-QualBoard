import { enums } from '2020-qb4';
import { TaskModel } from 'shared/models/task-model';
import { TextTaskLogicRuleSubjectModel }
  from 'shared/components/logic-builder/subjects/text-task-logic-rule-subject-model';
import { validateAndUnwrapCoreTaskRuleDto }
  from 'shared/components/logic-builder/subjects/validate-and-unwrap-core-task-rule-dto';
import tasks from '../test-tasks.json';

const taskModels = tasks.map(t => new TaskModel(t));
const RuleOperators = enums.ruleOperators;
const textTaskModel = taskModels[1];
const mcTaskModel = taskModels[4];
const text = 'lolwut';
const coreRuleMemberName = 'Text';
const allRegexCharacters = '.$^{[(|)]}*+?|\\';
const escaped = '\\.\\$\\^\\{\\[\\(\\|\\)\\]\\}\\*\\+\\?\\|\\\\';


const validDto = {
  operator: RuleOperators.and.int,
  rules: [{
    memberName: 'TaskResponses',
    operator: RuleOperators.containsAll.int,
    targetRules: [{
      memberName: coreRuleMemberName,
      operator: RuleOperators.regexMatch.int,
      targetValue: text,
    }],
  }, {
    memberName: 'Id',
    operator: RuleOperators.equal.int,
    targetValue: textTaskModel.id,
  }],
};

const operators = TextTaskLogicRuleSubjectModel.allowedOperators;

describe('TextTaskLogicRuleSubjectModel', () => {
  describe('constructor', () => {
    it('throws an error when not passed a task', () => {
      expect(() => new TextTaskLogicRuleSubjectModel()).toThrow(/supply the target task/);
    });

    it('throws an error when passed a task with type !== "Text"', () => {
      expect(() => new TextTaskLogicRuleSubjectModel({ task: mcTaskModel })).toThrow(/"Text"/);
    });

    describe('when given a valid text task', () => {
      let model;
      beforeEach(() => {
        model = new TextTaskLogicRuleSubjectModel({ task: textTaskModel });
      });

      it('defaults to operator "contains text"', () => {
        expect(model.operator).toBe(operators[0]);
      });

      it('sets name to task.title', () => {
        expect(model.name).toBe(textTaskModel.title);
      });
    });
  });

  describe('toDto()', () => {
    let subject;

    beforeEach(() => {
      subject = new TextTaskLogicRuleSubjectModel({
        task: textTaskModel,
        text: 'lol',
        operator: operators[0],
      });
    });

    it('throws an error when called while empty', () => {
      const model = new TextTaskLogicRuleSubjectModel({
        task: textTaskModel,
      });

      expect(() => model.toDto()).toThrow(/empty/);
    });

    it('"contains text" generates appropriate DTO structure', () => {
      const dto = subject.toDto();

      const { coreRule } = validateAndUnwrapCoreTaskRuleDto(dto, [textTaskModel]);

      expect(coreRule).toBeDefined();
      expect(coreRule.operator).toBe(subject.operator.ruleOperator.int);
      expect(coreRule.targetValue).toBe(subject.text);
    });

    it('"does not contain text" generates appropriate DTO structure', () => {
      subject.operator = operators[1];
      subject.text = 'mmmbeepith';
      const dto = subject.toDto();

      const { coreRule } = validateAndUnwrapCoreTaskRuleDto(dto, [textTaskModel]);

      expect(coreRule).toBeDefined();
      expect(coreRule.operator).toBe(subject.operator.ruleOperator.int);
      expect(coreRule.targetValue).toBe(subject.text);
    });

    it('escapes .NET regex characters', () => {
      subject.text = allRegexCharacters;

      const dto = subject.toDto();

      const { coreRule } = validateAndUnwrapCoreTaskRuleDto(dto, [textTaskModel])

      expect(coreRule.targetValue).toBe(escaped);
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

        expect(() => TextTaskLogicRuleSubjectModel.fromDto(dto, taskModels)).toThrow(/(no rules array)/);
      });
    });

    describe('with valid DTO', () => {
      it('"contains text" populates correctly', () => {
        const model = TextTaskLogicRuleSubjectModel.fromDto(validDto, taskModels);

        expect(model).toBeDefined();
        expect(model.operator).toBe(operators[0]);
        expect(model.task).toBe(textTaskModel);
        expect(model.text).toBe(text);
      });

      it('unescapes .NET regex characters', () => {
        const dto = JSON.parse(JSON.stringify(validDto));
        const { coreRule } = validateAndUnwrapCoreTaskRuleDto(dto, [textTaskModel]);
        coreRule.targetValue = escaped;

        const model = TextTaskLogicRuleSubjectModel.fromDto(dto, taskModels);

        expect(model.text).toBe(allRegexCharacters);
      });
    });
  });

  describe('clone()', () => {
    it('returns identical model', () => {
      const model = TextTaskLogicRuleSubjectModel.fromDto(validDto, taskModels);
      const clone = model.clone();

      expect(clone.text).toBe(model.text);
      expect(clone.operator).toBe(model.operator);
      expect(clone.task).toBe(model.task);
    });
  });

  describe('get isEmpty()', () => {
    it('returns false when it contains some text', () => {
      const model = TextTaskLogicRuleSubjectModel.fromDto(validDto, taskModels);

      expect(model.isEmpty).toBe(false);
    });

    it('returns true when it contains no text', () => {
      const model = TextTaskLogicRuleSubjectModel.fromDto(validDto, taskModels);
      model.text = '';

      expect(model.isEmpty).toBe(true);
    });
  });
});
