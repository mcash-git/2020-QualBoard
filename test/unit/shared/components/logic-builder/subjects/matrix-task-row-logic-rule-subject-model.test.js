import { enums } from '2020-qb4';
import { TaskModel } from 'shared/models/task-model';
import { MatrixTaskRowLogicRuleSubjectModel } from
  'shared/components/logic-builder/subjects/matrix-task-row-logic-rule-subject-model';
import { validateAndUnwrapCoreTaskRuleDto }
  from 'shared/components/logic-builder/subjects/validate-and-unwrap-core-task-rule-dto';
import tasks from '../test-tasks.json';

const taskModels = tasks.map(t => new TaskModel(t));
const RuleOperators = enums.ruleOperators;
const PromptTypes = enums.promptTypes;
const textTaskModel = taskModels[1];
const mmcTaskModel = taskModels.find(t => t.type === PromptTypes.matrixMultipleChoice.int);
const mmaTaskModel = taskModels.find(t => t.type === PromptTypes.matrixMultipleAnswer.int);
const mmcRow = mmcTaskModel.matrixRows[0];
const mmaRow = mmaTaskModel.matrixRows[0];
const columns = mmcTaskModel.matrixColumns;

const strings = {
  coreRuleMemberName: 'MatrixResponses',
  wrapperRuleMemberName: 'TaskResponses',
  rowId: 'RowId',
  colId: 'ColumnId',
  id: 'Id',
};


const validDto = {
  operator: RuleOperators.and.int,
  rules: [{
    memberName: strings.wrapperRuleMemberName,
    operator: RuleOperators.containsAll.int,
    targetRules: [{
      memberName: strings.coreRuleMemberName,
      operator: RuleOperators.containsNone.int,
      targetRules: [{
        operator: RuleOperators.and.int,
        rules: [{
          memberName: strings.rowId,
          operator: RuleOperators.equal,
          targetValue: mmcRow.rowId,
        }, {
          memberName: strings.colId,
          operator: RuleOperators.equal,
          targetValue: columns[0].columnId,
        }],
      }, {
        operator: RuleOperators.and.int,
        rules: [{
          memberName: strings.rowId,
          operator: RuleOperators.equal,
          targetValue: mmcRow.rowId,
        }, {
          memberName: strings.colId,
          operator: RuleOperators.equal,
          targetValue: columns[1].columnId,
        }],
      }],
    }],
  }, {
    memberName: strings.id,
    operator: RuleOperators.equal.int,
    targetValue: mmcTaskModel.id,
  }],
};

const operators = MatrixTaskRowLogicRuleSubjectModel.allAllowedOperators;

describe('MatrixTaskRowLogicRuleSubjectModel', () => {
  describe('constructor', () => {
    it('throws an error when not passed a task', () => {
      expect(() => new MatrixTaskRowLogicRuleSubjectModel({
        row: mmcRow,
      })).toThrow(/supply the target task/);
    });

    it('throws an error when passed a task with type !== "MatrixMultipleChoice"', () => {
      expect(() => new MatrixTaskRowLogicRuleSubjectModel({
        task: textTaskModel,
        row: mmcRow,
      })).toThrow(/"MatrixMultipleChoice"/);
    });

    it('throws an error when not passed a row', () => {
      expect(() => new MatrixTaskRowLogicRuleSubjectModel({
        task: mmcTaskModel,
      })).toThrow(/row/i);
    });

    describe('when given a valid matrix multiple choice task', () => {
      let model;
      beforeEach(() => {
        model = new MatrixTaskRowLogicRuleSubjectModel({
          task: mmcTaskModel,
          row: mmcRow,
        });
      });

      it('defaults to operator "contains any"', () => {
        expect(model.operator).toBe(operators.containsAny);
      });

      it('sets name to name', () => {
        expect(model.name).toBe(`(${mmcTaskModel.title}) - ${mmcRow.text}`);
      });

      it('sets allowedOperators without "contains all"', () => {
        expect(model.allowedOperators).not.toEqual(expect.arrayContaining([
          MatrixTaskRowLogicRuleSubjectModel.allAllowedOperators.containsAll,
        ]));
      });

      describe('task is matrix multiple choice', () => {
        it('sets module to mmc module', () => {
          expect(model.module).toBe('shared/components/logic-builder/subjects/matrix-multiple-choice-task-row-logic-rule-subject');
        });
      });

      describe('task is matrix multiple answer', () => {
        it('sets module to mma module', () => {
          model = new MatrixTaskRowLogicRuleSubjectModel({
            task: mmaTaskModel,
            row: mmaRow,
          });

          expect(model.module).toBe('shared/components/logic-builder/subjects/matrix-multiple-answer-task-row-logic-rule-subject');
        });
      });
    });


    describe('when given a valid matrix multiple answer task', () => {
      let model;
      beforeEach(() => {
        model = new MatrixTaskRowLogicRuleSubjectModel({
          task: mmaTaskModel,
          row: mmaRow,
        });
      });

      it('defaults to operator "contains any"', () => {
        expect(model.operator).toBe(operators.containsAny);
      });

      it('sets name to name', () => {
        expect(model.name).toBe(`(${mmaTaskModel.title}) - ${mmaRow.text}`);
      });

      it('sets allowedOperators with "contains all"', () => {
        expect(model.allowedOperators).toEqual(expect.arrayContaining([
          MatrixTaskRowLogicRuleSubjectModel.allAllowedOperators.containsAll,
        ]));
      });
    });
  });

  describe('toDto()', () => {
    let subject;
    const cols = columns.slice(0, 2);

    beforeEach(() => {
      subject = new MatrixTaskRowLogicRuleSubjectModel({
        task: mmcTaskModel,
        row: mmcRow,
        columns: cols.concat(),
        operator: operators.containsAny,
      });
    });

    it('throws an error when called while empty', () => {
      const model = new MatrixTaskRowLogicRuleSubjectModel({
        row: mmcRow,
        task: mmcTaskModel,
      });

      expect(() => model.toDto()).toThrow(/empty/);
    });

    it('"contains any" generates appropriate DTO structure', () => {
      const dto = subject.toDto();

      const { coreRule } = validateAndUnwrapCoreTaskRuleDto(dto, [mmcTaskModel]);

      expect(coreRule).toBeDefined();
      expect(coreRule.memberName).toBe(strings.coreRuleMemberName);
      expect(coreRule.operator).toBe(subject.operator.ruleOperator.int);
      expect(coreRule.targetRules).toHaveLength(2);

      let rowColRule = coreRule.targetRules[0];
      assertRowColRule(rowColRule, mmcRow.rowId, cols[0].columnId);

      rowColRule = coreRule.targetRules[1];
      assertRowColRule(rowColRule, mmcRow.rowId, cols[1].columnId);
    });

    it('"contains all" generates appropriate DTO structure', () => {
      subject.operator = operators.containsAll;
      subject.columns.push(columns[columns.length - 1]);
      const dto = subject.toDto();

      const { coreRule } = validateAndUnwrapCoreTaskRuleDto(dto, [mmcTaskModel]);

      expect(coreRule).toBeDefined();
      expect(coreRule.memberName).toBe(strings.coreRuleMemberName);
      expect(coreRule.operator).toBe(subject.operator.ruleOperator.int);
      expect(coreRule.targetRules).toHaveLength(3);

      let rowColRule = coreRule.targetRules[0];
      assertRowColRule(rowColRule, mmcRow.rowId, cols[0].columnId);

      rowColRule = coreRule.targetRules[1];
      assertRowColRule(rowColRule, mmcRow.rowId, cols[1].columnId);

      rowColRule = coreRule.targetRules[2];
      assertRowColRule(rowColRule, mmcRow.rowId, columns[columns.length - 1].columnId);
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

        expect(() => MatrixTaskRowLogicRuleSubjectModel.fromDto(dto, taskModels))
          .toThrow(/(no rules array)/);
      });
    });

    describe('with valid DTO', () => {
      it('"contains none" populates correctly', () => {
        const model =
          MatrixTaskRowLogicRuleSubjectModel.fromDto(validDto, taskModels);

        expect(model).toBeDefined();
        expect(model.operator).toBe(operators.containsNone);
        expect(model.task).toBe(mmcTaskModel);
        expect(model.row).toBe(mmcRow);
        expect(model.columns).toHaveLength(2);
        expect(model.columns).toEqual(expect.arrayContaining(columns.slice(0, 2)));
      });
    });
    
    describe('referenced row does not exist on task', () => {
      it('throws error with the target task ID and the referenced row ID', () => {
        const clonedMmcTaskModel = mmcTaskModel.clone(true);
        clonedMmcTaskModel.id = mmcTaskModel.id;
        clonedMmcTaskModel.matrixColumns = mmcTaskModel.matrixColumns;
        const taskModelsWithClone = [...taskModels];
        const replaceIndex = taskModelsWithClone.indexOf(mmcTaskModel);
        taskModelsWithClone.splice(replaceIndex, 1, clonedMmcTaskModel);
        
        let caught = false;
        try {
          MatrixTaskRowLogicRuleSubjectModel.fromDto(validDto, taskModelsWithClone);
        } catch (err) {
          expect(err.details).toBeDefined();
          expect(err.details.targetTaskId).toBe(clonedMmcTaskModel.id);
          expect(err.details.targetMatrixRowId).toBe(mmcTaskModel.matrixRows[0].rowId);
          caught = true;
        }
  
        expect(caught).toBe(true);
      });
    });
  
    describe('referenced column does not exist on task', () => {
      it('throws error with the target task ID and the referenced column ID', () => {
        const clonedMmcTaskModel = mmcTaskModel.clone(true);
        clonedMmcTaskModel.id = mmcTaskModel.id;
        clonedMmcTaskModel.matrixRows = mmcTaskModel.matrixRows;
        const taskModelsWithClone = [...taskModels];
        const replaceIndex = taskModelsWithClone.indexOf(mmcTaskModel);
        taskModelsWithClone.splice(replaceIndex, 1, clonedMmcTaskModel);
      
        let caught = false;
        try {
          MatrixTaskRowLogicRuleSubjectModel.fromDto(validDto, taskModelsWithClone);
        } catch (err) {
          expect(err.details).toBeDefined();
          expect(err.details.targetTaskId).toBe(clonedMmcTaskModel.id);
          expect(err.details.targetMatrixColumnId).toBe(mmcTaskModel.matrixColumns[0].columnId);
          caught = true;
        }
      
        expect(caught).toBe(true);
      });
    });
  });

  describe('clone()', () => {
    it('returns identical model', () => {
      const model = MatrixTaskRowLogicRuleSubjectModel.fromDto(validDto, taskModels);
      const clone = model.clone();

      expect(clone.columns).not.toBe(model.columns);
      expect(clone.columns).toEqual(expect.arrayContaining(model.columns));
      expect(clone.operator).toBe(model.operator);
      expect(clone.rowId).toBe(model.rowId);
      expect(clone.task).toBe(model.task);
    });
  });

  describe('get isEmpty()', () => {
    it('returns false when it contains at least one column', () => {
      const model = new MatrixTaskRowLogicRuleSubjectModel({
        task: mmcTaskModel,
        row: mmcRow,
      });

      model.columns.push(mmcTaskModel.matrixColumns[0]);

      expect(model.isEmpty).toBe(false);
    });

    it('returns true when it contains no text', () => {
      const model = new MatrixTaskRowLogicRuleSubjectModel({
        task: mmcTaskModel,
        row: mmcRow,
      });

      expect(model.isEmpty).toBe(true);
    });
  });
});

function assertRowColRule(rowColRule, rowId, colId) {
  expect(rowColRule.operator).toBe(RuleOperators.and.int);
  expect(rowColRule.rules).toHaveLength(2);
  expect(rowColRule.rules.find(r =>
    r.memberName === strings.rowId && r.targetValue === rowId)).toBeDefined();
  expect(rowColRule.rules.find(r =>
    r.memberName === strings.colId && r.targetValue === colId)).toBeDefined();
}
