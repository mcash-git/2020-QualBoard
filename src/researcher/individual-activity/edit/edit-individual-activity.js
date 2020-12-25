import { computedFrom, TaskQueue } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { BindingSignaler } from 'aurelia-templating-resources';
import { Api } from 'api/api';
import { growlProvider } from 'shared/growl-provider';
import { enums } from '2020-qb4';
import { TaskModel } from 'shared/models/task-model';
import { CurrentUser } from 'shared/current-user';
import { DialogService } from 'aurelia-dialog';
import { AppConfig } from 'app-config';
import { DomainState } from 'shared/app-state/domain-state';
import { compareBySortOrder } from 'shared/utility/compare-by-sort-order';
import { ViewState } from 'shared/app-state/view-state';
import { ChildViewState } from 'shared/app-state/child-view-state';
import getTaskRulesOmittingRule from 'shared/utility/get-task-rules-omitting-rule';

const PromptTypes = enums.promptTypes;
const ProjectRoles = enums.projectRoles;

// TODO: This class should be refactored into some smaller classes.
export class EditIndividualActivity {
  static inject = [
    Api,
    EventAggregator,
    BindingSignaler,
    TaskQueue,
    CurrentUser,
    DialogService,
    AppConfig,
    DomainState,
    ViewState,
  ];

  constructor(
    api,
    eventAggregator,
    bindingSignaler,
    taskQueue,
    user,
    modalService,
    appConfig,
    domainState,
    viewState,
  ) {
    this.api = api;
    this.ea = eventAggregator;
    this.bs = bindingSignaler;
    this.taskQueue = taskQueue;
    this.user = user;
    this.modalService = modalService;
    this.appConfig = appConfig;
    this.domainState = domainState;
    this.viewState = viewState;

    this.mediaApiUrl = appConfig.media.baseUrl;
    this.imageUriBase = appConfig.media.imageUriBase;
  }

  liElements = {};

  async canActivate({ iaId, projectId }) {
    this.iaId = iaId;
    this.projectId = projectId;
    this.activity = {};
    this.tasks = [];
    this.editState = {
      taskBeingEdited: null,
      original: null,
    };

    // get existing tasks from the API.
    await this._loadEverything(projectId, iaId);
  }

  async activate() {
    // depends on domainState, so can't go in canActivate()
    this._setUpDefaultModerator();
    this.childViewState = new ChildViewState({
      sidebarOpen: false,
      sidebarViewModel: 'researcher/individual-activity/edit/sidebar/event-builder-sidebar',
      sidebarModel: this,
      actionBarViewModel: 'researcher/individual-activity/edit/action-bar/event-builder-action-bar',
      actionBarModel: this,
    });

    this.viewState.childStateStack.push(this.childViewState);
  }

  deactivate() {
    this.viewState.childStateStack.pop();
  }

  // Event handlers:

  handleEdit(event) {
    this._setEditState(event.detail.task);
  }

  handleCancel() {
    this._stopEditing(false);
  }

  handleSave() {
    this._saveTask();
  }

  async handleSaveAddNew() {
    const insertAfter = this.editState.taskBeingEdited;
    const success = await this._saveTask();
    if (!success) {
      return;
    }

    this._insertNewTaskAfter(insertAfter);
  }

  async handleSaveAndDuplicate(event) {
    const success = await this._saveTask();
    if (!success) {
      return;
    }

    this.handleDuplicate(event);
  }

  handleInsert(event) {
    this._insertNewTaskAfter(event.detail.task);
  }

  handleDelete(event) {
    this.modalService.open({
      viewModel: 'shared/components/confirmation-modal',
      model: {
        text: 'Are you sure you want to delete this task from the activity?',
        title: 'Delete Confirmation',
        confirmButtonClass: 'btn-danger',
        confirmButtonText: 'Delete',
        cancelButtonClass: 'btn-outline-secondary',
      },
    }).whenClosed(result => {
      if (result.wasCancelled) {
        return;
      }
      this._deleteTask(event.detail.task);
    });
  }

  handleDuplicate(event) {
    const taskToDuplicate = event.detail.task;
    this._insertTask(taskToDuplicate.clone(true), taskToDuplicate);
  }

  addTaskToEnd() {
    // undefined is ok here (when empty)
    const taskAfterWhichToInsert = this.tasks[this.tasks.length - 1];

    this._insertNewTaskAfter(taskAfterWhichToInsert);
  }

  async openReorderDialog() {
    if (this.isReorderingTasks) {
      return;
    }

    this.isReorderingTasks = true;
    this.modalService.open({
      viewModel: 'researcher/individual-activity/edit/reorder-tasks-modal',
      model: {
        tasks: this.tasks.concat(),
        projectId: this.projectId,
        iaId: this.iaId,
      },
    }).whenClosed(result => {
      this.isReorderingTasks = false;
      if (result.wasCancelled) {
        return;
      }

      this.tasks = result.output;
      this.tasks.forEach((t, i) => {
        t.sortOrder = i + 1;
      });
      // find any tasks that are the subject of a task logic rule that no longer makes sense in the
      // new order
      this.tasks.forEach(t => {
        this._findTasksAndRuleSubjectsTargetingTask(t).forEach(taskAndSubjects => {
          if (taskAndSubjects.task.sortOrder <= t.sortOrder) {
            growlProvider.error('Broken Task Logic!', 'It looks like you reordered the tasks in ' +
              'such a way that a display logic rule now depends on a task that comes AFTER the ' +
              'task with the display logic rule.  The task with the display logic should have' +
              'the rule removed or it will not display to any participants.', { timeout: false });
          }
        });
      });
    });
  }

  // "Private" methods:

  async _deleteTask(task) {
    this._findTasksAndRuleSubjectsTargetingTask(task).forEach(() => {
      growlProvider.error('Broken Task Logic!', 'It looks like you deleted a task that was the ' +
        'target of a display logic rule.  The task with the display logic should have' +
        'the rule removed or it will not display to any participants.', { timeout: false });
    });

    const result = await this.api.command.tasks.delete(task);

    if (result.error) {
      growlProvider.error('Error Deleting Task', 'There was an error attempting to delete the task.');
      return;
    }

    this._removeTask(task);
  }

  _duplicateTask(task) {
    const dupe = task.clone(true);
    return dupe;
  }

  _getNewTask() {
    return new TaskModel({
      mediaApiUrl: this.mediaApiUrl,
      imageUriBase: this.imageUriBase,
      canEdit: true,
      individualActivityId: this.iaId,
      projectId: this.projectId,
      availableGroupTags: this.availableGroupTags,
      participants: this.participants,
      tasks: this.tasks,
    });
  }

  _insertNewTaskAfter(task) {
    this._insertTask(this._getNewTask(), task);
  }

  _insertTask(taskToInsert, taskAfterWhichToInsert = null) {
    taskToInsert.insertAfterTaskId = taskAfterWhichToInsert && taskAfterWhichToInsert.id;
    // -1 ok here (insert at 0)
    const index = this.tasks.indexOf(taskAfterWhichToInsert);
    this.tasks.splice(index + 1, 0, taskToInsert);
    this.tasks.forEach((t, i) => {
      t.sortOrder = i;
    });
    this._setEditState(taskToInsert);
  }

  async _saveTask() {
    growlProvider.removeValidationGrowls();
    // save to the API first.
    if (!this._validate()) {
      return false;
    }

    const success = await this._cleanAndSaveTaskToApi(this.editState.taskBeingEdited);

    if (!success) {
      return false;
    }

    // if no errors:
    this._applyChangesToOriginalTask();
    this._stopEditing();
    return true;
  }

  _applyChangesToOriginalTask() {
    this.editState.original.id = this.editState.taskBeingEdited.id;
    const taskIndex = this.tasks.indexOf(this.editState.original);
    this.tasks.splice(taskIndex, 1, this.editState.taskBeingEdited);
  }

  _setEditState(task) {
    if (this.editState.taskBeingEdited) {
      return;
    }
    const taskBeingEdited = task.clone(false);
    taskBeingEdited.initializeValidation();

    this.editState = {
      original: task,
      taskBeingEdited,
    };

    // Don't set this until you have set this.editState.taskBeingEdited
    // or you will encounter binding errors:
    task.isBeingEdited = true;
    this.childViewState.sidebarOpen = true;

    this._scrollToTask(task);
  }

  _stopEditing(wasSaved) {
    this.childViewState.sidebarOpen = false;
    this.editState.original.isBeingEdited = false;
    this.editState.taskBeingEdited = null;

    if (!wasSaved && !this.editState.original.id) {
      this._removeTask(this.editState.original);
    } else {
      this._scrollToTask(this.editState.original);
    }
  }

  _removeTask(task) {
    const index = this.tasks.indexOf(task);
    this.tasks.splice(index, 1);
    this.tasks.slice(index).forEach(t => t.sortOrder--);
    if (this.tasks.length === 0) {
      return;
    }

    const taskToScrollTo = this.tasks[Math.max(0, index - 1)];
    this._scrollToTask(taskToScrollTo);
  }

  _scrollToTask(task) {
    setTimeout(() => {
      this.viewState.scrollIntoView(this.liElements[task.id]);
    }, 200);
  }

  async _loadEverything(projectId, iaId) {
    const [{ tasks, canEditTasks }, projectUsers, eventParticipants, groupTags] =
      await Promise.all([
        this.api.query.individualActivities
          .getTasks(projectId, iaId),
        this.api.query.projectUsers.getProjectUsers(projectId),
        this.api.query.eventParticipants.getForEvent({ projectId, iaId }),
        this.api.query.groupTags.getGroupTags(projectId),
      ]);

    this.canEditTasks = canEditTasks;
    this.moderators = projectUsers
      .filter(pu => pu.role === ProjectRoles.moderator.int);
    this.participants = eventParticipants;
    this.availableGroupTags = groupTags;

    await this._initializeFromTasks(tasks);
  }

  async _initializeFromTasks(tasks) {
    // Switched to use `.reduce()` here because I need to pass the array of task models in to each
    // task model constructor so it can properly parse out task logic rules.
    this.tasks = tasks.concat()
      .sort(compareBySortOrder)
      .reduce((taskModels, task) => {
        task.mediaApiUrl = this.mediaApiUrl;
        task.imageUriBase = this.imageUriBase;
        task.canEdit = this.canEditTasks;
        task.availableGroupTags = this.availableGroupTags;
        task.participants = this.participants;
        task.tasks = taskModels;

        let taskModel = null;
        while (taskModel === null) {
          taskModel = this._tryCreateTaskModelAndRemoveBadRules(task);
        }
        taskModels.push(taskModel);
        return taskModels;
      }, []);
  }

  _tryCreateTaskModelAndRemoveBadRules(dto) {
    try {
      return new TaskModel(dto);
    } catch (e) {
      // we are only handling logic rule errors in which logic rules target nonexistent items
      if (!e.details) {
        throw e;
      }

      growlProvider.error(
        'Display Logic Error',
        `It looks like you have a task with broken display logic.  Task titled "${dto.title
        }" needs to update its display logic rules or no participants will be able to see it.`,
      );

      dto.taskLogicRules = getTaskRulesOmittingRule(dto.taskLogicRules, e.details.rule);

      return null;
    }
  }

  _setUpDefaultModerator() {
    this.moderatorId = this.domainState.individualActivity.defaultModeratorUserId ||
      '00000000-0000-0000-0000-000000000000';
  }

  _validate() {
    const validationResult = this.editState.taskBeingEdited.validate();

    if (validationResult.isValid) {
      return true;
    }

    const errors = [...validationResult.errors];
    growlProvider.error('Unable to Save', errors.join('<br />'), { class: 'validation-error' });

    return false;
  }

  async _cleanAndSaveTaskToApi(task) {
    task.projectId = this.projectId;
    this._removeEmptyMatrixTags(task);
    const success = await this._processTaskTags(task);

    if (!success) {
      growlProvider.error('Error', 'There was an error saving new tags.');
      return false;
    }

    const dto = task.toDto();
    const result = await (!dto.id ?
      this.api.command.tasks.create(dto) :
      this.api.command.tasks.update(dto));

    if (dto.id) {
      this._updateTaskInLogicRules(task);
    }

    if (result.error || !result.id) {
      growlProvider.error('Error', 'There was an error saving the task.');
      return false;
    }

    task.id = result.id;

    return true;
  }

  _updateTaskInLogicRules(task) {
    const tasksAndSubjects = this._findTasksAndRuleSubjectsTargetingTask(task);

    tasksAndSubjects.forEach(taskAndSubjects => {
      taskAndSubjects.subjects.forEach(subject => {
        // TODO:  Handle task type changes (see relevant discussion:
        // https://2020ip.slack.com/archives/G079VNDH9/p1494013434996260)
        // TODO:  Handle deleting a task that has rules targeting it
        // TODO:  Handle reordering tasks

        if (subject.task.type !== task.type) {
          growlProvider.error('Broken Task Logic!', 'It looks like you changed the type of a task ' +
            'that was the target of a display logic rule.  The task with the display logic should have' +
            'the rule removed or it will not display to any participants.', { timeout: false });
        }

        subject.task = task;
        subject.name = task.title;
      });
    });
  }

  _findTasksAndRuleSubjectsTargetingTask(task) {
    return this.tasks.reduce((tasksAndSubjects, t) => {
      if (!t.masterLogicRuleSetTasks || !t.masterLogicRuleSetTasks.ruleSets) {
        return tasksAndSubjects;
      }
      const subjects = [];

      t.masterLogicRuleSetTasks.ruleSets.forEach(rs => {
        if (!rs || !rs.rules) {
          return;
        }

        rs.rules.forEach(r => {
          if (!r || !r.subject || !r.subject.task || r.subject.task.id !== task.id) {
            return;
          }

          subjects.push(r.subject);
        });
      });

      if (subjects.length > 0) {
        tasksAndSubjects.push({ task: t, subjects });
      }

      return tasksAndSubjects;
    }, []);
  }

  _removeEmptyMatrixTags(task) {
    if (!PromptTypes[task.type].value.startsWith('Matrix')) {
      task.matrixGroupTags = [];
      return;
    }

    task.matrixGroupTags = task.matrixGroupTags
      .filter(mgt => mgt.groupTagObjects.length > 0);
  }

  async _processTaskTags(task) {
    const success = await this._findAndSaveNewTagsInTask(task);
    if (!success) {
      return success;
    }
    if (task.type === 1) {
      return true;
    }

    if (task.type === 2 || task.type === 3) {
      task.options.forEach(option => {
        option.groupTags = option.groupTagObjects.map(t => t.id);
      });
      return true;
    }

    if (task.type === 4 || task.type === 5) {
      task.matrixGroupTags.forEach(mgt => {
        mgt.groupTags = mgt.groupTagObjects.map(t => t.id);
      });
      return true;
    }

    return true;
  }

  // return true for success, false for failure
  async _findAndSaveNewTagsInTask(task) {
    // only multiple (choice|answer) are currently supported.
    const allTags = [];
    if (task.type === 1) {
      return true;
    }
    if (task.type === 2 || task.type === 3) {
      allTags.push(...this._getAllMcmaTags(task));
    } else if (task.type === 4 || task.type === 5) {
      allTags.push(...this._getAllMatrixTags(task));
    }

    allTags.push(...this._getUnsavedRuleTags(task));

    const unique = {};
    const isUnique = tag => {
      if (unique[tag.name]) {
        return false;
      }
      unique[tag.name] = 1;
      return true;
    };

    const newTags = allTags.filter(t => !t.id && isUnique(t));
    if (newTags.length === 0) {
      return true;
    }

    const result = await this.api.command.groupTags.batchCreate({
      projectId: this.projectId,
      newTags,
    });

    if (result.error) {
      growlProvider.error('Error', 'There was an error saving the new tags.');
      return false;
    }

    return true;
  }

  _getUnsavedRuleTags(task) {
    return Array.from(task.masterLogicRuleSetUsers.ruleSets.reduce((tagSet, ruleSet) => {
      ruleSet.rules.filter(r => !r.isEmpty && r.subject.groupTags).forEach(rule => {
        rule.subject.groupTags.filter(tag => !tag.id).forEach(tag => tagSet.add(tag));
      });
      return tagSet;
    }, new Set()));
  }

  _getAllMcmaTags(task) {
    return reduceTags(task.options);
  }

  _getAllMatrixTags(task) {
    return reduceTags(task.matrixGroupTags);
  }

  @computedFrom('isEditing', 'canEditTasks')
  get canAddAndEdit() {
    return !this.isEditing && this.canEditTasks;
  }

  @computedFrom('editState.taskBeingEdited')
  get isEditing() {
    return this.editState.taskBeingEdited !== null;
  }
}

//
// HELPERS:
//

function reduceTags(tagContainer) {
  return tagContainer.reduce((result, current) => {
    if (!current.groupTagObjects) {
      throw new Error('reduceTags called on an array with an object without a .groupTagObjects property.');
    }
    if (current.groupTagObjects.length) {
      result.push(...current.groupTagObjects);
    }

    return result;
  }, []);
}
