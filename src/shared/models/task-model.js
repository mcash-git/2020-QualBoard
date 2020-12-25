import { computedFrom } from 'aurelia-framework';
import { Validator } from '2020-aurelia';
import { enums } from '2020-qb4';
import { MasterLogicRuleSetModel }
  from 'shared/components/logic-builder/master-logic-rule-set-model';
import { LogicRuleSubjectGroupModel }
  from 'shared/components/logic-builder/subjects/logic-rule-subject-group-model';
import { TextTaskLogicRuleSubjectModel }
  from 'shared/components/logic-builder/subjects/text-task-logic-rule-subject-model';
import { McmaTaskLogicRuleSubjectModel }
  from 'shared/components/logic-builder/subjects/mcma-task-logic-rule-subject-model';
import { MatrixTaskRowLogicRuleSubjectModel } from
  'shared/components/logic-builder/subjects/matrix-task-row-logic-rule-subject-model';
import { LogicRuleSetModel } from 'shared/components/logic-builder/logic-rule-set-model';
import { LogicRuleModel } from 'shared/components/logic-builder/logic-rule-model';
import { MediaDescriptorModel } from 'shared/media/media-descriptor-model';
import { createGuid } from 'shared/utility/create-guid';
import { compareBySortOrder } from 'shared/utility/compare-by-sort-order';
import { rules as validationRules } from './validation/task-model-validation';

const PromptTypes = enums.promptTypes;

export class McmaOptionModel {
  constructor({
    groupTags = [],
    optionId = null,
    reportingAlias = null,
    sortOrder = null,
    text = '',
    availableGroupTags = [],
  } = {}) {
    this.groupTags = groupTags;
    this.optionId = optionId;
    this.reportingAlias = reportingAlias;
    this.sortOrder = sortOrder;
    this.text = text;

    this.groupTagObjects = groupTags
      .map(tagId => availableGroupTags
        .find(tag => tag.id === tagId));
  }
}

export class MatrixRowModel {
  constructor({
    rowId = null,
    sortOrder = 0,
    text = null,
  } = {}) {
    this.rowId = rowId;
    this.sortOrder = sortOrder;
    this.text = text;
  }
}

export class MatrixColumnModel {
  constructor({
    columnId = null,
    sortOrder = 0,
    text = null,
  } = {}) {
    this.columnId = columnId;
    this.sortOrder = sortOrder;
    this.text = text;
  }
}

export class CellGroupTagsModel {
  constructor({
    columnId = null,
    rowId = null,
    groupTags = [],
    availableGroupTags = [],
  } = {}) {
    this.columnId = columnId;
    this.rowId = rowId;
    this.groupTags = groupTags;
    this.availableGroupTags = availableGroupTags;

    this.groupTagObjects = groupTags
      .map(tagId => availableGroupTags
        .find(tag => tag.id === tagId));
  }
}

export class TaskModel {
  // TODO:  Change this constructor to initialize from another TaskModel, and add a static fromDto()
  constructor({
    id = null,
    individualActivityId = null,
    title = null,
    text = null,
    type = 0,
    platformLimit = 0,
    responseTextRequired = false,
    mediaRequired = false,
    isActive = true,
    autoWrapOptions = false,
    projectUserLogicRules = [],
    taskLogicRules = [],
    media = [],
    minimumOptionsRequired = 1,
    maximumOptionsLimit = null,
    insertAfterTaskId = null,
    canEdit = true,
    options = [],
    matrixColumns = [],
    matrixRows = [],
    matrixGroupTags = [],
    sortOrder = null,

    // The following are not fields on the back-end object:
    projectId = null,
    availableGroupTags = [],
    participants = [],
    mediaApiUrl = null,
    imageUriBase = null,
    masterLogicRuleSetUsers = null,
    masterLogicRuleSetTasks = null,
    tasks = [],
  } = {}) {
    this.id = id;
    this.individualActivityId = individualActivityId;
    this.title = title;
    this.text = text;
    this.type = type;
    this.platformLimit = platformLimit;
    this.responseTextRequired = responseTextRequired;
    this.mediaRequired = mediaRequired;
    this.isActive = isActive;
    this.autoWrapOptions = autoWrapOptions;
    this.minimumOptionsRequired = minimumOptionsRequired;
    this.maximumOptionsLimit = maximumOptionsLimit;
    this.insertAfterTaskId = insertAfterTaskId;
    this.canEdit = canEdit;
    this.projectId = projectId;
    this.availableGroupTags = availableGroupTags;
    this.participants = participants;
    this.tasks = tasks;
    this.sortOrder = sortOrder;

    this.matrixGroupTags = matrixGroupTags
      .map(mgt => new CellGroupTagsModel(Object.assign(mgt, {
        availableGroupTags,
      })));

    const availableItems = {
      participants,
      groupTags: availableGroupTags,
      tasks,
    };

    this._initRules({
      masterLogicRuleSetUsers,
      masterLogicRuleSetTasks,
      projectUserLogicRules,
      taskLogicRules,
      availableItems,
    });

    this.options = options.sort(compareBySortOrder)
      .map(o => new McmaOptionModel(Object.assign(o, { availableGroupTags })));

    this.matrixColumns = matrixColumns.concat().sort(compareBySortOrder)
      .map(col => new MatrixColumnModel(col));

    this.matrixRows = matrixRows.concat().sort(compareBySortOrder)
      .map(row => new MatrixRowModel(row));

    this.mediaApiUrl = mediaApiUrl;
    // media may be a simple array or already an instance of MediaDescriptorModel
    this.media = media.map(m => new MediaDescriptorModel({
      ...m,
      mediaApiUrl,
      imageUriBase: m.imageUriBase || imageUriBase,
    }));
  }

  initializeValidation() {
    this.validator = new Validator(this);
    validationRules.forEach(rule => this.validator.registerRule(rule));
  }

  validate() {
    if (!this.validator) {
      throw new
      Error('Validator is not initialized, unable to validate task model');
    }
    return this.validator.validate();
  }

  clone(isNewTask) {
    const matrixGroupTags = [...this.matrixGroupTags].map(mgt => new CellGroupTagsModel({
      ...mgt,
    }));
    const init = isNewTask ? {
      ...this,
      id: null,
      options: [...this.options].map(o => new McmaOptionModel({
        ...o,
        optionId: createGuid(),
        availableGroupTags: this.availableGroupTags,
      })),
      matrixColumns: [...this.matrixColumns].map(mc => {
        const col = new MatrixColumnModel({
          ...mc,
          columnId: createGuid(),
        });
        matrixGroupTags
          .filter(mgt => mgt.columnId === mc.columnId)
          .forEach(mgt => { mgt.columnId = col.columnId; });
        return col;
      }),
      matrixRows: [...this.matrixRows].map(mr => {
        const row = new MatrixRowModel({
          ...mr,
          rowId: createGuid(),
        });
        matrixGroupTags
          .filter(mgt => mgt.rowId === mr.rowId)
          .forEach(mgt => { mgt.rowId = row.rowId; });
        return row;
      }),
      matrixGroupTags,
    } : this;

    return new TaskModel(init);
  }

  toDto() {
    setSortOrders(this.options);
    setSortOrders(this.matrixColumns);
    setSortOrders(this.matrixRows);

    return {
      autoWrapOptions: this.autoWrapOptions,
      id: this.id,
      insertAfterTaskId: this.insertAfterTaskId,
      sortOrder: this.sortOrder,
      media: this.media,
      matrixGroupTags: this.matrixGroupTags,
      matrixColumns: this.matrixColumns,
      matrixRows: this.matrixRows,
      maximumOptionsLimit: this.maximumOptionsLimit,
      mediaRequired: this.mediaRequired,
      minimumOptionsRequired: this.minimumOptionsRequired,
      options: this.options,
      platformLimit: this.platformLimit,
      projectUserLogicRules: this.masterLogicRuleSetUsers.isEmpty ?
        [] :
        [this.masterLogicRuleSetUsers.toDto()],
      taskLogicRules: this.masterLogicRuleSetTasks.isEmpty ?
        [] :
        [this.masterLogicRuleSetTasks.toDto()],
      responseTextRequired: this.responseTextRequired,
      text: this.text,
      title: this.title,
      type: this.type,
      individualActivityId: this.individualActivityId,
      projectId: this.projectId,
    };
  }

  toTaskLogicSubjectGroup() {
    switch (this.type) {
      case PromptTypes.text.int:
        return new LogicRuleSubjectGroupModel({
          subjects: [new TextTaskLogicRuleSubjectModel({ task: this })],
          title: '',
        });
      case PromptTypes.multipleChoice.int:
      case PromptTypes.multipleAnswer.int:
        return new LogicRuleSubjectGroupModel({
          subjects: [new McmaTaskLogicRuleSubjectModel({ task: this })],
          title: '',
        });
      case PromptTypes.matrixMultipleChoice.int:
      case PromptTypes.matrixMultipleAnswer.int:
        return new LogicRuleSubjectGroupModel({
          subjects: this.matrixRows.map(row =>
            new MatrixTaskRowLogicRuleSubjectModel({
              row,
              task: this,
              name: row.text,
            })),
          title: this.title,
        });
      default:
        return null;
    }
  }

  _initRules({
    masterLogicRuleSetUsers,
    masterLogicRuleSetTasks,
    projectUserLogicRules,
    taskLogicRules,
    availableItems,
  }) {
    if (masterLogicRuleSetUsers) {
      // init from another task-model:
      this.masterLogicRuleSetUsers = masterLogicRuleSetUsers.clone();
    } else {
      // init from DTO.  TODO:  Change to use fromDto() pattern.
      this.masterLogicRuleSetUsers = projectUserLogicRules.length > 0 ?
        MasterLogicRuleSetModel.fromDto(projectUserLogicRules[0], availableItems) :
        new MasterLogicRuleSetModel({
          ruleSets: [
            new LogicRuleSetModel({
              rules: [
                new LogicRuleModel(),
              ],
              operator: LogicRuleSetModel.allowedOperators[0],
            }),
          ],
        });
    }

    if (masterLogicRuleSetTasks) {
      this.masterLogicRuleSetTasks = masterLogicRuleSetTasks.clone();
    } else {
      this.masterLogicRuleSetTasks = taskLogicRules.length > 0 ?
        MasterLogicRuleSetModel.fromDto(taskLogicRules[0], availableItems) :
        new MasterLogicRuleSetModel({
          ruleSets: [
            new LogicRuleSetModel({
              rules: [
                new LogicRuleModel(),
              ],
              operator: LogicRuleSetModel.allowedOperators[0],
            }),
          ],
        });
    }
  }


  @computedFrom('type')
  get savedViewModel() {
    const vm = getViewModelName(this.type);

    return `./${vm}/saved-${vm}`;
  }

  @computedFrom('type')
  get editViewModel() {
    const vm = getViewModelName(this.type);

    return `./${vm}/edit-${vm}`;
  }

  @computedFrom('type')
  get iconClass() {
    return PromptTypes[this.type].icon;
  }
}

function getViewModelName(typeInt) {
  const err = () => {
    throw new Error('Unrecognized type value:', typeInt);
  };

  const type = PromptTypes[typeInt];

  return ({
    Text: () => 'text',
    Notice: () => 'notice',
    MultipleChoice: () => 'mcma',
    MultipleAnswer: () => 'mcma',
    MatrixMultipleChoice: () => 'matrix',
    MatrixMultipleAnswer: () => 'matrix',
  }[type.value] || err)();
}

function setSortOrders(items) {
  items.forEach((it, i) => { it.sortOrder = i; });
}
