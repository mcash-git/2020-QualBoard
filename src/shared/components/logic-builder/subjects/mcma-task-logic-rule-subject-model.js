import { computedFrom } from 'aurelia-framework';
import { enums } from '2020-qb4';
import { InvalidTaskRuleError } from 'researcher/common/invalid-task-rule-error';
import { wrapCoreTaskDto } from './wrap-core-task-dto';
import { LogicRuleSubjectOperator } from './logic-rule-subject-operator';
import { LogicRuleSubjectModel } from './logic-rule-subject-model';
import { validateAndUnwrapCoreTaskRuleDto } from './validate-and-unwrap-core-task-rule-dto';

const RuleOperators = enums.ruleOperators;
const PromptTypes = enums.promptTypes;
const memberName = 'ResponseOptions';

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
  (type === PromptTypes.multipleChoice ? mcOperators : maOperators);

export class McmaTaskLogicRuleSubjectModel extends LogicRuleSubjectModel {
  constructor({
    options = [],
    operator = null,
    task = null,
  } = {}) {
    validate();
    
    const type = PromptTypes[task.type];
    const module = `shared/components/logic-builder/subjects/multiple-${
      type === PromptTypes.multipleChoice ? 'choice' : 'answer'}-task-logic-rule-subject`;
    const allowedOperators = mapTypeToAllowedOperators(type);
    
    // TODO:  name should be changed when we remove the task titles
    super({
      name: task.title, module, allowedOperators, operator,
    });
    
    this.options = options;
    this.task = task;
    this.operator = operator || allowedOperators[0];
    
    function validate() {
      if (!task) {
        throw new Error('You must supply the target task');
      }
      
      if (PromptTypes[task.type] !== PromptTypes.multipleAnswer &&
      PromptTypes[task.type] !== PromptTypes.multipleChoice) {
        throw new Error(`Target task must be of type "MultipleChoice" or  "MultipleAnswer".  Instead, it is: ${
          JSON.stringify(task.type)}`);
      }
    }
  }
  
  static allAllowedOperators = allAllowedOperators;
  
  static fromDto(dto, availableTasks) {
    const { task, coreRule } = validateAndUnwrapCoreTaskRuleDto(dto, availableTasks);
    const options = coreRule.targetValue.split(',')
      .map(id => {
        const option = task.options.find(o => o.optionId === id);
        if (!option) {
          throw new InvalidTaskRuleError('invalid rule found', {
            targetTaskId: task.id,
            targetOptionId: id,
            rule: dto,
          });
        }
        return option;
      });
  
    return new McmaTaskLogicRuleSubjectModel({
      task,
      options,
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
      targetValue: this.options.map(o => o.optionId).join(','),
    }, this.task);
  }
  
  clone() {
    return new McmaTaskLogicRuleSubjectModel({
      task: this.task,
      options: this.options
        .map(o1 => this.task.options.find(o2 => o1.optionId === o2.optionId))
        .filter(o => o !== undefined),
      operator: this.operator,
    });
  }
  
  @computedFrom('options.length')
  get isEmpty() {
    return !this.options || this.options.length === 0;
  }
}
