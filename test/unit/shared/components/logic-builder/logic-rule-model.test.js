import { enums } from '2020-qb4';
import { TaskModel } from 'shared/models/task-model';
import { LogicRuleModel } from 'shared/components/logic-builder/logic-rule-model';
import { UsersLogicRuleSubjectModel }
  from 'shared/components/logic-builder/subjects/users-logic-rule-subject-model';
import { TagsLogicRuleSubjectModel }
  from 'shared/components/logic-builder/subjects/tags-logic-rule-subject-model';
import users from './test-users.json';
import tags from './test-tags.json';
import tasks from './test-tasks.json';

const PromptTypes = enums.promptTypes;
const taskModels = tasks.map(t => new TaskModel(t));
const textTask = taskModels.find(t => t.type === PromptTypes.text.int);
const mcTask = taskModels.find(t => t.type === PromptTypes.multipleChoice.int);
const maTask = taskModels.find(t => t.type === PromptTypes.multipleAnswer.int);
const mmcTask = taskModels.find(t => t.type === PromptTypes.matrixMultipleChoice.int);
const mmaTask = taskModels.find(t => t.type === PromptTypes.matrixMultipleAnswer.int);

const availableItems = { participants: users, groupTags: tags, tasks: taskModels };

describe('LogicRuleModel', () => {
  describe('fromDto()', () => {
    describe('with invalid DTO', () => {
      it('has unknown memberName and is not a task rule', () => {
        const dto = {
          memberName: 'Skeleton',
          targetValue: 'Basghetti',
          operator: 10,
        };

        expect(() => LogicRuleModel.fromDto(dto, availableItems)).toThrow(/invalid/);
      });
    });

    describe('valid', () => {
      describe('memberName "UserId"', () => {
        it('is populated with UsersLogicRuleSubjectModel', () => {
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

          const model = LogicRuleModel.fromDto(dto, availableItems);

          expect(model).toBeInstanceOf(LogicRuleModel);
          expect(model.subject.constructor.name).toBe(UsersLogicRuleSubjectModel.name);
        });
      });

      describe('memberName "GroupTags"', () => {
        it('is populated with TagsLogicRuleSubjectModel', () => {
          const dto = {
            memberName: 'GroupTags',
            operator: 11,
            targetValue: 'e0e95fa5-9423-42d4-b075-574c9ce952ad,437ef08d-2c8a-4025-b599-b05c97e211b4',
          };

          const model = LogicRuleModel.fromDto(dto, availableItems);

          expect(model).toBeInstanceOf(LogicRuleModel);
          expect(model.subject.constructor.name).toBe(TagsLogicRuleSubjectModel.name);
        });
      });
    });
    
    describe('target task not found', () => {
      it('throws an error with the target task ID', () => {
        const id = 'not-found-id';
        const dto = {
          operator: 8,
          rules: [{
            memberName: 'TaskResponses',
            operator: 8,
            targetRules: [{
              memberName: 'ResponseOptions',
              operator: 9,
              targetValue: 'asdf,fdsa',
            }],
          }, {
            memberName: 'Id',
            operator: 0,
            targetValue: 'not-found-id',
          }],
        };
        
        expect(() => LogicRuleModel.fromDto(dto));
        
        let caught = false;
        try {
          LogicRuleModel.fromDto(dto, availableItems);
        } catch (err) {
          expect(err.details).toBeDefined();
          expect(err.details.targetTaskId).toBe(id);
          caught = true;
        }
  
        expect(caught).toBe(true);
      });
    });
  });

  describe('clone()', () => {
    it('calls clone() on the containing subject', () => {
      const clonedSubject = {};
      const mockSubject = {
        isEmpty: false,
        clone: () => clonedSubject,
      };
      const model = new LogicRuleModel({
        subject: mockSubject,
      });

      const cloned = model.clone();

      expect(cloned.subject).toBe(clonedSubject);
    });
  });

  describe('get isEmpty()', () => {
    describe('when subject is null', () => {
      it('returns true', () => {
        const model = new LogicRuleModel();

        expect(model.isEmpty).toBe(true);
      });
    });

    describe('when subject is empty', () => {
      it('returns true', () => {
        const model = new LogicRuleModel();

        model.subject = { isEmpty: true };
        expect(model.isEmpty).toBe(true);
      });
    });

    describe('when subject is not empty', () => {
      it('returns false', () => {
        const model = new LogicRuleModel();

        model.subject = { isEmpty: false };
        expect(model.isEmpty).toBe(false);
      });
    });
  });

  describe('toDto', () => {
    describe('when empty', () => {
      it('throws error', () => {
        const model = new LogicRuleModel();

        expect(() => model.toDto()).toThrow(/empty/);
      });
    });

    describe('returns its subject.toDto()', () => {
      const returnVal = {};
      const subject = {
        isEmpty: false,
        toDto() {
          return returnVal;
        },
      };
      const model = new LogicRuleModel({ subject });

      const dto = model.toDto();
      expect(dto).toBe(returnVal);
    });
  });
});
