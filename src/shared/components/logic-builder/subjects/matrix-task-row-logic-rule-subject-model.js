import { enums } from '2020-qb4';
import { InvalidTaskRuleError } from 'researcher/common/invalid-task-rule-error';
import { wrapCoreTaskDto } from './wrap-core-task-dto';
import { LogicRuleSubjectOperator } from './logic-rule-subject-operator';
import { LogicRuleSubjectModel } from './logic-rule-subject-model';
import { validateAndUnwrapCoreTaskRuleDto } from './validate-and-unwrap-core-task-rule-dto';

const RuleOperators = enums.ruleOperators;
const PromptTypes = enums.promptTypes;
const memberName = 'MatrixResponses';
const rowRuleMemberName = 'RowId';
const colRuleMemberName = 'ColumnId';

const allAllowedOperators = {
  containsAny: new LogicRuleSubjectOperator({
    ruleOperator: RuleOperators.containsAny,
    friendly: 'contains any',
  }),
  containsAll: new LogicRuleSubjectOperator({
    ruleOperator: RuleOperators.containsAll,
    friendly: 'contains all',
  }),
  containsNone: new LogicRuleSubjectOperator({
    ruleOperator: RuleOperators.containsNone,
    friendly: 'contains none',
  }),
};

const mcOperators = [allAllowedOperators.containsAny, allAllowedOperators.containsNone];
const maOperators = [
  allAllowedOperators.containsAny,
  allAllowedOperators.containsAll,
  allAllowedOperators.containsNone,
];

// we are guaranteed that task is not null, and is mmc or mma type.
const mapTypeToAllowedOperators = type =>
  (type === PromptTypes.matrixMultipleChoice ? mcOperators : maOperators);

export class MatrixTaskRowLogicRuleSubjectModel extends LogicRuleSubjectModel {
  constructor({
    row = null,
    columns = [],
    operator = null,
    task = null,
  } = {}) {
    validate();

    const type = PromptTypes[task.type];
    const allowedOperators = mapTypeToAllowedOperators(type);
    const module = `shared/components/logic-builder/subjects/matrix-multiple-${type === PromptTypes.matrixMultipleChoice ? 'choice' : 'answer'}-task-row-logic-rule-subject`;
    const name = `(${task.title}) - ${row.text}`;

    // TODO:  name should be changed when we remove the task titles
    super({
      name, module, allowedOperators, operator,
    });

    this.row = row;
    this.columns = columns;
    this.task = task;
    this.operator = operator || allowedOperators[0];

    function validate() {
      if (!task) {
        throw new Error('You must supply the target task');
      }

      if (PromptTypes[task.type] !== PromptTypes.matrixMultipleChoice &&
        PromptTypes[task.type] !== PromptTypes.matrixMultipleAnswer) {
        throw new Error(`Target task must be of type "MatrixMultipleChoice" or "MatrixMultipleAnswer".  Instead, it is: ${
          JSON.stringify(task.type)}`);
      }

      if (!row) {
        throw new Error('You must supply the matrix row.');
      }
    }
  }

  static allAllowedOperators = allAllowedOperators;

  static fromDto(dto, availableTasks) {
    const { task, coreRule } = validateAndUnwrapCoreTaskRuleDto(dto, availableTasks);
    const rowId = getRowIdFromCoreRule(coreRule);
    const row = task.matrixRows.find(r => r.rowId === rowId);

    if (!row) {
      throw new InvalidTaskRuleError('Invalid task rule found - missing row', {
        targetTaskId: task.id,
        targetMatrixRowId: rowId,
        rule: dto,
      });
    }

    const columns = coreRule.targetRules.map(r => {
      const colId = r.rules.find(tr => tr.memberName === colRuleMemberName).targetValue;
      const column = task.matrixColumns.find(c => c.columnId === colId);
      if (!column) {
        throw new InvalidTaskRuleError('Invalid task rule found - missing column', {
          targetTaskId: task.id,
          targetMatrixColumnId: colId,
          rule: dto,
        });
      }
      return column;
    });

    return new MatrixTaskRowLogicRuleSubjectModel({
      task,
      row,
      columns,
      operator: Object.values(allAllowedOperators)
        .find(o => o.ruleOperator.int === coreRule.operator),
    });
  }

  toDto() {
    if (this.isEmpty) {
      throw new Error('Cannot call toDto() on an empty rule subject - remove empty items' +
        'before transforming into DTOs.');
    }

    return wrapCoreTaskDto({
      memberName,
      operator: this.operator.ruleOperator.int,
      targetRules: this.columns.map(c => ({
        operator: RuleOperators.and.int,
        rules: [
          this.rowRule,
          {
            memberName: colRuleMemberName,
            operator: RuleOperators.equal.int,
            targetValue: c.columnId,
          },
        ],
      })),
    }, this.task);
  }

  clone() {
    return new MatrixTaskRowLogicRuleSubjectModel({
      task: this.task,
      columns: this.columns
        .map(c1 => this.task.matrixColumns.find(c2 => c1.columnId === c2.columnId))
        .filter(c => c !== undefined),
      row: this.row,
      operator: this.operator,
    });
  }

  get rowRule() {
    return {
      memberName: rowRuleMemberName,
      operator: RuleOperators.equal.int,
      targetValue: this.row.rowId,
    };
  }

  get isEmpty() {
    return !this.columns || this.columns.length === 0;
  }
}

function getRowIdFromCoreRule(coreRule) {
  return coreRule.targetRules[0].rules.find(r => r.memberName === rowRuleMemberName).targetValue;
}
