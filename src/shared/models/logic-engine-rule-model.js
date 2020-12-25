import { computedFrom, observable } from 'aurelia-framework';
import { enums } from '2020-qb4';

const RuleOperators = enums.ruleOperators;

export class LogicEngineRuleModel {
  constructor({
    memberName = '',
    operator = null,
    targetValue = '',
    targetRules = [],
    rules = [],

    // not on back end object properties:
    groupTags = [],
    users = [],
    availableGroupTags = [],
    availableUsers = [],
  } = {}) {
    this.operator = operator;
    this.targetValue = targetValue;
    this.targetRules = targetRules;
    this.rules = rules;
    this.groupTags = groupTags;
    this.users = users;

    this.availableGroupTags = availableGroupTags;
    this.availableUsers = availableUsers;

    // IMPORTANT!!! This is an observed property that depends on the previous values being set.
    this.memberName = memberName;
  }

  @observable memberName;

  memberNameChanged(newValue, oldValue) {
    // NOTE:  Do not remove the way this is done.
    // Just using @observable memberName; didn't work because when we serialize,
    // for whatever reason, observable properties don't seem to get serialized
    // by the json() (aurelia-http-client) method.
    if (!this._isInitialized) {
      this._initialize(newValue);
    }

    if (oldValue) {
      this._saveRuleState(oldValue);
      this._switchTo(newValue);
    }
  }

  toDto() {
    return this[`_toDto${this.memberName}`]();
  }

  _toDtoGroupTags() {
    return {
      memberName: this.memberName,
      operator: this.operator,
      targetValue: this.groupTags.map(tag => tag.id).join(','),
    };
  }

  _toDtoUserId() {
    const idOperator =
      RuleOperators[this.operator] === RuleOperators.and ?
        RuleOperators.notEqual.int :
        RuleOperators.equal.int;

    return {
      memberName: this.memberName,
      operator: this.operator,
      rules: this.users.map(u => ({
        memberName: this.memberName,
        operator: idOperator,
        targetValue: u.userId,
      })),
    };
  }


  _switchTo(memberName) {
    this.operator = this[`operator${memberName}`];
    switch (memberName) {
      case 'GroupTags':
        if (!this.operator) {
          this.operator = RuleOperators.containsAll.int;
        }
        break;
      case 'UserId':
        if (!this.operator) {
          this.operator = RuleOperators.or.int;
        }
        break;
      default:
        // throw new Error('Unexpected LogicEngineRule type');
    }
  }

  _saveRuleState(memberName) {
    this[`operator${memberName}`] = this.operator;
  }

  _initialize(memberName) {
    switch (memberName) {
      case 'GroupTags':
        this._initializeGroupTagsRule();
        break;
      case 'UserId':
        this._initializeUsersRule();
        break;
      default:
        break;
    }

    this._isInitialized = true;
  }

  _initializeGroupTagsRule() {
    if (!this.targetValue || !this.targetValue.trim()) {
      return;
    }
    this.groupTags = this.targetValue.split(',')
      .map(id => this.availableGroupTags
        .find(tag => tag.id.toLowerCase() === id));
  }

  _initializeUsersRule() {
    if (!this.rules || this.rules.length === 0) {
      return;
    }
    this.users = this.rules
      .map(rule => this.availableUsers
        .find(user => user.userId.toLowerCase() ===
          rule.targetValue.toLowerCase()));
  }

  // TODO:  Support the other rule types.
  @computedFrom('memberName', 'groupTags')
  get isEmpty() {
    switch (this.memberName) {
      case 'GroupTags':
        return this.groupTags.length === 0;
      case 'UserId':
        return this.users.length === 0;
      default:
        return true;
    }
  }

  @computedFrom('memberName')
  get viewModel() {
    const base = 'shared/components/logic-engine/logic-engine-rule-';

    switch (this.memberName) {
      case 'GroupTags':
        return `${base}group-tags`;
      case 'UserId':
        return `${base}users`;
      default:
        return '';
    }
  }
}
