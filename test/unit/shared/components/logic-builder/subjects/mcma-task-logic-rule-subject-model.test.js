import { enums } from '2020-qb4';
import { TaskModel } from 'shared/models/task-model';
import { McmaTaskLogicRuleSubjectModel }
  from 'shared/components/logic-builder/subjects/mcma-task-logic-rule-subject-model';
import { validateAndUnwrapCoreTaskRuleDto }
  from 'shared/components/logic-builder/subjects/validate-and-unwrap-core-task-rule-dto';
import tasks from '../test-tasks.json';

const taskModels = tasks.map(t => new TaskModel(t));
const RuleOperators = enums.ruleOperators;
const PromptTypes = enums.promptTypes;
const textTaskModel = taskModels[1];
const mcTaskModel = taskModels.find(task => task.type === PromptTypes.multipleChoice.int);
const maTaskModel = taskModels[7];
const coreRuleMemberName = 'ResponseOptions';
const optionsSet1 = maTaskModel.options.slice(0, 2);
const optionsSet2 = maTaskModel.options.slice(1, 3);

const validDto = {
  operator: RuleOperators.and.int,
  rules: [{
    memberName: 'TaskResponses',
    operator: RuleOperators.containsAll.int,
    targetRules: [{
      memberName: coreRuleMemberName,
      operator: RuleOperators.containsAny.int,
      targetValue: optionArrayToTargetValue(optionsSet1),
    }],
  }, {
    memberName: 'Id',
    operator: RuleOperators.equal.int,
    targetValue: maTaskModel.id,
  }],
};

const operators = McmaTaskLogicRuleSubjectModel.allAllowedOperators;

describe('McmaTaskLogicRuleSubjectModel', () => {
  describe('constructor', () => {
    it('throws an error when not passed a task', () => {
      expect(() => new McmaTaskLogicRuleSubjectModel()).toThrow(/supply the target task/);
    });

    it('throws an error when passed a task with type !== "MultipleAnswer" and !== "MultipleChoice',
      () => {
        expect(() => new McmaTaskLogicRuleSubjectModel({ task: textTaskModel }))
          .toThrow(/"MultipleAnswer"/);
      });

    describe('when given a valid multiple answer or multiple choice task', () => {
      let model;

      describe('MA tasks', () => {
        beforeEach(() => {
          model = new McmaTaskLogicRuleSubjectModel({ task: maTaskModel });
        });

        it('defaults to operator "contains any"', () => {
          expect(model.operator).toBe(operators.containsAny);
        });

        it('sets name to task.title', () => {
          expect(model.name).toBe(maTaskModel.title);
        });

        it('sets allowedOperators to include "contains all"', () => {
          expect(model.allowedOperators).toHaveLength(3);
          expect(model.allowedOperators).toEqual(expect.arrayContaining([operators.containsAll]));
        });

        it('sets module to MA module', () => {
          expect(model.module).toBe('shared/components/logic-builder/subjects/multiple-answer' +
            '-task-logic-rule-subject');
        });
      });

      describe('MC tasks', () => {
        beforeEach(() => {
          model = new McmaTaskLogicRuleSubjectModel({ task: mcTaskModel });
        });

        it('defaults to operator "contains any"', () => {
          expect(model.operator).toBe(operators.containsAny);
        });

        it('sets name to task.title', () => {
          expect(model.name).toBe(mcTaskModel.title);
        });

        it('sets allowedOperators to NOT include "contains all"', () => {
          expect(model.allowedOperators).toHaveLength(2);
          expect(model.allowedOperators)
            .not.toEqual(expect.arrayContaining([operators.containsAll]));
        });

        it('sets module to MC module', () => {
          expect(model.module).toBe('shared/components/logic-builder/subjects/multiple-choice' +
            '-task-logic-rule-subject');
        });
      });
    });
  });

  describe('toDto()', () => {
    let subject;

    beforeEach(() => {
      subject = new McmaTaskLogicRuleSubjectModel({
        task: maTaskModel,
        options: optionsSet2,
        operator: operators.containsAny,
      });
    });

    it('throws an error when called while empty', () => {
      const model = new McmaTaskLogicRuleSubjectModel({
        options: [],
        task: maTaskModel,
      });

      expect(() => model.toDto()).toThrow(/empty/);
    });

    it('"contains any" generates appropriate DTO structure', () => {
      const dto = subject.toDto();

      const { coreRule } = validateAndUnwrapCoreTaskRuleDto(dto, [maTaskModel]);

      expect(coreRule).toBeDefined();
      expect(coreRule.memberName).toBe('ResponseOptions');
      expect(coreRule.operator).toBe(subject.operator.ruleOperator.int);
      expect(coreRule.targetValue).toBe(optionArrayToTargetValue(subject.options));
    });

    it('"contains all" generates appropriate DTO structure', () => {
      subject.operator = operators.containsAll;
      const dto = subject.toDto();

      const { coreRule } = validateAndUnwrapCoreTaskRuleDto(dto, [maTaskModel]);

      expect(coreRule).toBeDefined();
      expect(coreRule.memberName).toBe('ResponseOptions');
      expect(coreRule.operator).toBe(subject.operator.ruleOperator.int);
      expect(coreRule.targetValue).toBe(optionArrayToTargetValue(subject.options));
    });

    it('"contains none" generates appropriate DTO structure', () => {
      subject.operator = operators.containsNone;
      const dto = subject.toDto();

      const { coreRule } = validateAndUnwrapCoreTaskRuleDto(dto, [maTaskModel]);

      expect(coreRule).toBeDefined();
      expect(coreRule.memberName).toBe('ResponseOptions');
      expect(coreRule.operator).toBe(subject.operator.ruleOperator.int);
      expect(coreRule.targetValue).toBe(optionArrayToTargetValue(subject.options));
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

        expect(() => McmaTaskLogicRuleSubjectModel.fromDto(dto, taskModels))
          .toThrow(/(no rules array)/);
      });
    });

    describe('with valid DTO', () => {
      it('"contains any" populates correctly', () => {
        const model = McmaTaskLogicRuleSubjectModel.fromDto(validDto, taskModels);

        expect(model).toBeDefined();
        expect(model.operator).toBe(operators.containsAny);
        expect(model.task).toBe(maTaskModel);
        expect(model.options).toEqual(expect.arrayContaining(optionsSet1));
      });
    });
    
    describe('referenced optionID does not exist on target task', () => {
      it('throws an error with the target task ID and the target option ID', () => {
        const clonedMaTaskModel = maTaskModel.clone(true);
        clonedMaTaskModel.id = maTaskModel.id;
        const taskModelsWithClone = [...taskModels];
        const replaceIndex = taskModelsWithClone.indexOf(maTaskModel);
        taskModelsWithClone.splice(replaceIndex, 1, clonedMaTaskModel);
        
        let caught = false;
        try {
          McmaTaskLogicRuleSubjectModel.fromDto(validDto, taskModelsWithClone);
        } catch (err) {
          expect(err.details).toBeDefined();
          expect(err.details.targetTaskId).toBe(clonedMaTaskModel.id);
          expect(err.details.targetOptionId).toBe(maTaskModel.options[0].optionId);
          caught = true;
        }
        
        expect(caught).toBe(true);
      });
    });
  });

  describe('clone()', () => {
    it('returns identical model', () => {
      const model = McmaTaskLogicRuleSubjectModel.fromDto(validDto, taskModels);
      const clone = model.clone();

      expect(clone.options).not.toBe(model.options);
      expect(clone.options).toEqual(expect.arrayContaining(model.options));
      expect(clone.operator).toBe(model.operator);
      expect(clone.task).toBe(model.task);
    });
  });

  describe('get isEmpty()', () => {
    it('returns false when it contains at least one option', () => {
      const model = new McmaTaskLogicRuleSubjectModel({ task: maTaskModel });
      model.options.push(maTaskModel.options.containsAny);

      expect(model.isEmpty).toBe(false);
    });

    it('returns true when it contains no text', () => {
      const model = new McmaTaskLogicRuleSubjectModel({ task: maTaskModel });

      expect(model.isEmpty).toBe(true);
    });
  });
});

function optionArrayToTargetValue(options) {
  return options.map(o => o.optionId).join(',');
}
