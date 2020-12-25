import { computedFrom } from 'aurelia-framework';
import { enums } from '2020-qb4';
import { escapeRegexString, unescapeRegexString } from 'shared/utility/dotnet-regex-utility';
import { wrapCoreTaskDto } from './wrap-core-task-dto';
import { LogicRuleSubjectOperator } from './logic-rule-subject-operator';
import { LogicRuleSubjectModel } from './logic-rule-subject-model';
import { validateAndUnwrapCoreTaskRuleDto } from './validate-and-unwrap-core-task-rule-dto';

const RuleOperators = enums.ruleOperators;
const PromptTypes = enums.promptTypes;
const memberName = 'Text';
const module = 'shared/components/logic-builder/subjects/text-task-logic-rule-subject';
const allowedOperators = [
  new LogicRuleSubjectOperator({
    ruleOperator: RuleOperators.regexMatch,
    friendly: 'contains text',
  }),
  new LogicRuleSubjectOperator({
    ruleOperator: RuleOperators.regexNotMatch,
    friendly: 'does not contain text',
  }),
];

export class TextTaskLogicRuleSubjectModel extends LogicRuleSubjectModel {
  constructor({
    text = '',
    operator = null,
    task = null,
  } = {}) {
    validate();
    
    // TODO:  name should be changed when we remove the task titles
    super({
      name: task.title, module, allowedOperators, operator,
    });
    
    this.text = text;
    this.task = task;
    this.operator = operator || allowedOperators[0];
    
    function validate() {
      if (!task) {
        throw new Error('You must supply the target task');
      }
      
      if (PromptTypes[task.type] !== PromptTypes.text) {
        throw new Error(`Target task must be of type "Text".  Instead, it is: ${
          JSON.stringify(task.type)}`);
      }
    }
  }
  
  static allowedOperators = allowedOperators;
  
  static fromDto(dto, availableTasks) {
    const { task, coreRule } = validateAndUnwrapCoreTaskRuleDto(dto, availableTasks);

    return new TextTaskLogicRuleSubjectModel({
      task,
      text: unescapeRegexString(coreRule.targetValue),
      operator: allowedOperators.find(o => o.ruleOperator.int === coreRule.operator),
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
      targetValue: escapeRegexString(this.text),
    }, this.task);
  }
  
  clone() {
    return new TextTaskLogicRuleSubjectModel({
      task: this.task,
      text: this.text,
      operator: this.operator,
    });
  }
  
  @computedFrom('text')
  get isEmpty() {
    return !this.text || !this.text.trim();
  }
}
