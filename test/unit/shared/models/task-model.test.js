import { enums } from '2020-qb4';
import { TaskModel } from 'shared/models/task-model';
import users from '../components/logic-builder/test-users.json';
import tags from '../components/logic-builder/test-tags.json';
import tasks from '../components/logic-builder/test-tasks.json';

const PromptTypes = enums.promptTypes;

const usersLogicRuleDto = {
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

const tagsLogicRuleDto = {
  memberName: 'GroupTags',
  operator: 11,
  targetValue: 'e0e95fa5-9423-42d4-b075-574c9ce952ad,437ef08d-2c8a-4025-b599-b05c97e211b4',
};

const textTaskLogicRuleDto = {
  operator: 8,
  rules: [{
    memberName: 'TaskResponses',
    operator: 11,
    targetRules: [{
      memberName: 'Text',
      operator: 6,
      targetValue: 'razor',
    }],
  }, {
    memberName: 'Id',
    operator: 0,
    targetValue: tasks[1].id,
  }],
};

const ruleSetDtoUsers = {
  operator: 8,
  rules: [usersLogicRuleDto, tagsLogicRuleDto],
};

const ruleSetDtoTasks = {
  operator: 8,
  rules: [textTaskLogicRuleDto],
};

const masterRuleSetDtoUsers = {
  operator: 8,
  rules: [ruleSetDtoUsers],
};

const masterRuleSetDtoTasks = {
  operator: 8,
  rules: [ruleSetDtoTasks],
};

const getOpts = (task) => task.options.map(o => o.optionId);

describe('TaskModel', () => {
  describe('constructor', () => {
    describe('with empty projectUserLogicRules', () => {
      it('sets masterLogicRuleSetUsers as new/empty MasterLogicRuleSetModel', () => {
        const model = new TaskModel({ projectUserLogicRules: [] });

        expect(model.masterLogicRuleSetUsers).toBeDefined();
        expect(model.masterLogicRuleSetUsers.ruleSets).toBeDefined();
      });
    });

    describe('with empty taskLogicRules', () => {
      it('sets masterLogicRuleSetTasks as new/empty MasterLogicRuleSetModel', () => {
        const model = new TaskModel({ taskLogicRules: [] });

        expect(model.masterLogicRuleSetTasks).toBeDefined();
        expect(model.masterLogicRuleSetTasks.ruleSets).toBeDefined();
      });
    });

    describe('with projectUserLogicRules', () => {
      it('transforms the DTO to a MasterLogicRuleSetModel', () => {
        const model = new TaskModel({
          projectUserLogicRules: [masterRuleSetDtoUsers],
          availableGroupTags: tags,
          participants: users,
        });

        expect(model.masterLogicRuleSetUsers).toBeDefined();
        expect(model.masterLogicRuleSetUsers.operator.int).toBe(masterRuleSetDtoUsers.operator);
        expect(model.masterLogicRuleSetUsers.ruleSets).toHaveLength(1);
      });
    });

    describe('with taskLogicRules', () => {
      it('transforms the DTO to a MasterLogicRuleSetModel', () => {
        const taskModels = tasks.concat().map(t => new TaskModel(t));
        const model = new TaskModel({
          taskLogicRules: [masterRuleSetDtoTasks],
          tasks: taskModels,
        });

        expect(model.masterLogicRuleSetTasks).toBeDefined();
        expect(model.masterLogicRuleSetTasks.operator.int).toBe(masterRuleSetDtoTasks.operator);
        expect(model.masterLogicRuleSetTasks.ruleSets).toHaveLength(1);
      });
    });
  });

  describe('toDto()', () => {
    describe('when masterLogicRuleSetUsers is empty', () => {
      it('serializes projectUserLogicRules as empty array', () => {
        const model = new TaskModel({ projectUserLogicRules: [] });
        const taskDto = model.toDto();

        expect(taskDto.projectUserLogicRules).toHaveLength(0);
      });
    });

    describe('when masterLogicRuleSetUsers is not empty', () => {
      it('serializes projectUserLogicRules', () => {
        const model = new TaskModel({ projectUserLogicRules: [] });
        const mockDto = {};
        const mockMasterRule = {
          isEmpty: false,
          toDto: () => mockDto,
        };
        model.masterLogicRuleSetUsers = mockMasterRule;

        const taskDto = model.toDto();

        expect(taskDto.projectUserLogicRules).toHaveLength(1);
        expect(taskDto.projectUserLogicRules).toContain(mockDto);
      });
    });

    describe('when masterLogicRuleSetTasks is empty', () => {
      it('serializes taskLogicRules as empty array', () => {
        const model = new TaskModel({ taskLogicRules: [] });
        const taskDto = model.toDto();

        expect(taskDto.projectUserLogicRules).toHaveLength(0);
      });
    });

    describe('when masterLogicRuleSetTasks is not empty', () => {
      it('serializes projectUserLogicRules', () => {
        const model = new TaskModel({ taskLogicRules: [] });
        const mockDto = {};
        const mockMasterRule = {
          isEmpty: false,
          toDto: () => mockDto,
        };
        model.masterLogicRuleSetTasks = mockMasterRule;

        const taskDto = model.toDto();

        expect(taskDto.taskLogicRules).toHaveLength(1);
        expect(taskDto.taskLogicRules).toContain(mockDto);
      });
    });
  });

  describe('toTaskLogicSubjectGroup()', () => {
    describe('when PromptType is "Text"', () => {
      it('returns group containing one TextTaskLogicRuleSubjectModel', () => {
        const model = new TaskModel();
        model.type = PromptTypes.text.int;

        const subjectGroup = model.toTaskLogicSubjectGroup();

        expect(subjectGroup.subjects).toHaveLength(1);

        const subject = subjectGroup.subjects[0];

        expect(subject.constructor.name).toBe('TextTaskLogicRuleSubjectModel');
      });
    });

    describe('when PromptType is "MultipleChoice"', () => {
      it('returns group containing one McmaTaskLogicRuleSubjectModel', () => {
        const model = new TaskModel();
        model.type = PromptTypes.multipleChoice.int;

        const subjectGroup = model.toTaskLogicSubjectGroup();

        expect(subjectGroup.subjects).toHaveLength(1);

        const subject = subjectGroup.subjects[0];

        expect(subject.constructor.name).toBe('McmaTaskLogicRuleSubjectModel');
      });
    });

    describe('when PromptType is "MultipleAnswer"', () => {
      it('returns group containing one McmaTaskLogicRuleSubjectModel', () => {
        const model = new TaskModel();
        model.type = PromptTypes.multipleAnswer.int;

        const subjectGroup = model.toTaskLogicSubjectGroup();

        expect(subjectGroup.subjects).toHaveLength(1);

        const subject = subjectGroup.subjects[0];

        expect(subject.constructor.name).toBe('McmaTaskLogicRuleSubjectModel');
      });
    });

    describe('when PromptType is "MatrixMultipleChoice"', () => {
      it('returns group containing a MatrixTaskRowLogicRuleSubjectModel per row',
        () => {
          const dto = {
            type: PromptTypes.matrixMultipleChoice.int,
            matrixRows: [{
              rowId: 'asdf',
              text: 'here is some text',
              sortOrder: 0,
            }, {
              rowId: 'fdsa',
              text: 'text some is here',
              sortOrder: 2,
            }, {
              rowId: 'aaaaaaaa',
              text: 'aaaaaaaaaaaaaaaa',
              sortOrder: 3,
            }],
            title: 'This is the title of the task.',
          };
          const model = new TaskModel(dto);

          const subjectGroup = model.toTaskLogicSubjectGroup();

          expect(subjectGroup).toBeDefined();
          expect(subjectGroup.title).toBe(dto.title);
          expect(subjectGroup.subjects).toHaveLength(3);

          model.matrixRows.forEach((r, i) => {
            const subject = subjectGroup.subjects[i];

            expect(subject.constructor.name).toBe('MatrixTaskRowLogicRuleSubjectModel');
            expect(subject.name).toBe(`(${model.title}) - ${r.text}`);
            expect(subject.row).toBe(r);
          });
        });
    });

    describe('when PromptType is "MatrixMultipleAnswer"', () => {
      it('returns group containing a MatrixTaskRowLogicRuleSubjectModel per row',
        () => {
          const dto = {
            type: PromptTypes.matrixMultipleAnswer.int,
            matrixRows: [{
              rowId: 'asdf',
              text: 'here is some text',
              sortOrder: 0,
            }, {
              rowId: 'fdsa',
              text: 'text some is here',
              sortOrder: 2,
            }, {
              rowId: 'aaaaaaaa',
              text: 'aaaaaaaaaaaaaaaa',
              sortOrder: 3,
            }],
            title: 'This is the title of the task.',
          };
          const model = new TaskModel(dto);

          const subjectGroup = model.toTaskLogicSubjectGroup();

          expect(subjectGroup).toBeDefined();
          expect(subjectGroup.title).toBe(dto.title);
          expect(subjectGroup.subjects).toHaveLength(3);

          model.matrixRows.forEach((r, i) => {
            const subject = subjectGroup.subjects[i];

            expect(subject.constructor.name).toBe('MatrixTaskRowLogicRuleSubjectModel');
            expect(subject.name).toBe(`(${model.title}) - ${r.text}`);
            expect(subject.row).toBe(r);
          });
        });
    });
  });
  
  describe('clone()', () => {
    let mcmaTask;
    let cloned;
    
    describe('when the task is MCMA', () => {
      beforeEach(() => {
        mcmaTask = new TaskModel(tasks.find(t => t.type === 2));
      });
  
      describe('when isNewTask is true', () => {
        beforeEach(() => {
          cloned = mcmaTask.clone(true);
        });
    
        it('properly sets optionIds to new IDs', () => {
          const sourceIds = getOpts(mcmaTask);
          const clonedIds = getOpts(cloned);
          
          console.error('ISNEW IS TRUE', { sourceIds, clonedIds });
      
          expect(clonedIds).toHaveLength(sourceIds.length);
          expect(clonedIds.every(id => sourceIds.indexOf(id) === -1)).toBe(true);
        });
        
        it('clears the task ID', () => {
          expect(cloned.id).toBeNull();
        });
      });
  
      describe('when isNewTask is false', () => {
        beforeEach(() => {
          cloned = mcmaTask.clone(false);
        });
    
        it('keeps optionIds the same as the source object', () => {
          const sourceIds = getOpts(mcmaTask);
          const clonedIds = getOpts(cloned);
  
          console.error('ISNEW IS FALSE', { sourceIds, clonedIds });
  
          expect(clonedIds).toHaveLength(sourceIds.length);
          expect(clonedIds.every(id => sourceIds.indexOf(id) !== -1)).toBe(true);
        });
  
        it('does not clear the task ID', () => {
          expect(cloned.id).toBe(mcmaTask.id);
        });
      });
    });
  });
});
