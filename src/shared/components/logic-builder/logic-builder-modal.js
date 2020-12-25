import { enums } from '2020-qb4';
import { computedFrom } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DialogController } from 'aurelia-dialog';
import { Api } from 'api/api';
import { LogicRuleSetModel } from './logic-rule-set-model';
import { LogicRuleModel } from './logic-rule-model';
import { TagsLogicRuleSubjectModel } from './subjects/tags-logic-rule-subject-model';
import { LogicRuleSubjectGroupModel } from './subjects/logic-rule-subject-group-model';
import { UsersLogicRuleSubjectModel } from './subjects/users-logic-rule-subject-model';

const RuleOperators = enums.ruleOperators;

export class LogicBuilderModal {
  static inject = [
    Api,
    DialogController,
    Element,
    EventAggregator,
  ];

  constructor(
    api,
    dialogController,
    element,
    eventAggregator,
  ) {
    this.api = api;
    this.dialogController = dialogController;
    this.element = element;
    this.ea = eventAggregator;
    this.allowedOperators = [RuleOperators.and, RuleOperators.or];
  }

  activate({
    masterRuleSet = null,
    type = null,
    availableItems = null,
  } = {}) {
    validate();

    this.availableItems = availableItems;

    // used for generating the rule placeholders each time a logic rule is added in the UI
    this.subjectGroupFactory = getSubjectGroupFactoryFromType(type, availableItems);
    this.masterRuleSet = masterRuleSet.clone();
    this.masterRuleSet.operator =
      this.allowedOperators.find(o => o.int === this.masterRuleSet.operator.int);

    function validate() {
      if (masterRuleSet === null) {
        throw new Error('You must provide the masterRuleSet to the logic-builder-modal.');
      }

      if (type === null) {
        throw new Error('You must provide the type of available subjects to the ' +
          'logic-builder-modal.');
      }

      if (type !== 'user' && type !== 'task') {
        throw new Error(`Unrecognized logic modal type: ${type}`);
      }

      if (!availableItems) {
        throw new
        Error('Must supply an object with the available tags, users, previous tasks, etc.');
      }
    }
  }

  attached() {
    this._applyModalClasses();
  }

  removeRuleSet(e) {
    const { ruleSet } = e.detail;

    const index = this.masterRuleSet.ruleSets.indexOf(ruleSet);
    if (index === -1) {
      throw new Error('ruleSet not found on masterRuleSet');
    }

    this.masterRuleSet.ruleSets.splice(index, 1);
  }

  modalClose() {
    this.dialogController.cancel();
  }

  addRuleSet() {
    this.masterRuleSet.ruleSets.push(new LogicRuleSetModel({
      rules: [
        new LogicRuleModel(),
      ],
      operator: LogicRuleSetModel.allowedOperators[0],
    }));
  }

  save() {
    this.dialogController.ok(this.masterRuleSet);
  }

  _applyModalClasses() {
    this.dialogController.renderer.dialogContainer.classList
      .add('full-screen-modal');
    this.dialogController.renderer.dialogOverlay.classList
      .add('full-screen-modal');
  }

  @computedFrom('masterRuleSet.operator')
  get operatorClass() {
    return this.masterRuleSet.operator.value.toLowerCase();
  }
}

function getSubjectGroupFactoryFromType(type, availableItems) {
  // When it's time to combine user and task logic, all we need to do here is combine these two
  // arrays.
  if (type === 'user') {
    return {
      getSubjectGroups() {
        return [
          new LogicRuleSubjectGroupModel({
            subjects: [new TagsLogicRuleSubjectModel({ availableGroupTags: availableItems.tags })],
          }),
          new LogicRuleSubjectGroupModel({
            subjects: [new UsersLogicRuleSubjectModel({ availableUsers: availableItems.users })],
          }),
        ];
      },
    };
  }

  if (type === 'task') {
    return {
      getSubjectGroups() {
        return availableItems.tasks
          .map(task => task.toTaskLogicSubjectGroup())
          .filter(t => t !== null);
      },
    };
  }

  // TODO:  Flesh out the tasks one.
  return [];
}
