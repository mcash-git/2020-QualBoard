import { computedFrom } from 'aurelia-framework';
import { enums } from '2020-qb4';
import { InvalidTaskRuleError } from 'researcher/common/invalid-task-rule-error';
import { McmaTaskLogicRuleSubjectModel }
  from './subjects/mcma-task-logic-rule-subject-model';
import { MatrixTaskRowLogicRuleSubjectModel } from
  './subjects/matrix-task-row-logic-rule-subject-model';
import { UsersLogicRuleSubjectModel } from './subjects/users-logic-rule-subject-model';
import { TagsLogicRuleSubjectModel } from './subjects/tags-logic-rule-subject-model';
import { TextTaskLogicRuleSubjectModel } from './subjects/text-task-logic-rule-subject-model';

const PromptTypes = enums.promptTypes;

export class LogicRuleModel {
  constructor({
    subject = null,
  } = {}) {
    this.subject = subject;
  }

  static fromDto(dto, availableItems) {
    let subject;

    switch (dto.memberName) {
      case 'UserId':
        subject = UsersLogicRuleSubjectModel.fromDto(dto, availableItems.participants);
        break;
      case 'GroupTags':
        subject = TagsLogicRuleSubjectModel.fromDto(dto, availableItems.groupTags);
        break;
      default:
        // try to parse a task logic rule subject
        subject = parseTaskRuleSubject(dto, availableItems.tasks);
        break;
    }

    return new LogicRuleModel({ subject });
  }

  toDto() {
    if (this.isEmpty) {
      throw new Error('Unable to call toDto() on an empty logic rule.  Remove empty items before' +
        'calling toDto().');
    }

    return this.subject.toDto();
  }

  clone() {
    return new LogicRuleModel({
      subject: this.subject ? this.subject.clone() : null,
    });
  }

  @computedFrom('subject.isEmpty')
  get isEmpty() {
    return !this.subject || this.subject.isEmpty;
  }
}

function parseTaskRuleSubject(dto, tasks) {
  if (!dto.rules || dto.rules.length === 0) {
    throw new Error(`Cannot parse logic rule, invalid DTO: ${JSON.stringify({ dto })}`);
  }
  const taskId = dto.rules.find(r => r.memberName === 'Id').targetValue;
  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    throw new InvalidTaskRuleError('Task logic rule references task that either does not exist ' +
      'or comes after the owning task', {
      targetTaskId: taskId,
      rule: dto,
    });
  }
  switch (task.type) {
    case PromptTypes.text.int:
      return TextTaskLogicRuleSubjectModel.fromDto(dto, tasks);
    case PromptTypes.multipleChoice.int:
    case PromptTypes.multipleAnswer.int:
      return McmaTaskLogicRuleSubjectModel.fromDto(dto, tasks);
    case PromptTypes.matrixMultipleChoice.int:
    case PromptTypes.matrixMultipleAnswer.int:
      return MatrixTaskRowLogicRuleSubjectModel.fromDto(dto, tasks);
    default:

      return null;
  }
}
