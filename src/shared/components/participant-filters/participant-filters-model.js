import { computedFrom } from 'aurelia-framework';
import moment from 'moment';
import { LogicEngineRuleModel } from 'shared/models/logic-engine-rule-model';

export class ParticipantFiltersModel {
  constructor({
    projectId = null,
    page = 1,
    pageSize = 25,
    projectUserLogicRules = [],
    taskIds = [],
    assetTypes = [],
    createdAfter = null,
    createdBefore = null,
    // not DTO fields:
    participants = [],
    availableGroupTags = [],
    // analytics filter fields:
  } = {}) {
    this.projectId = projectId;
    this.page = page;
    this.pageSize = pageSize;
    this.taskIds = taskIds;
    this.assetTypes = assetTypes;
    this.createdAfter = createdAfter;
    this.createdBefore = createdBefore;

    this.participants = participants;
    this.availableGroupTags = availableGroupTags;

    this.projectUserLogicRules =
      projectUserLogicRules
        .map(r => new LogicEngineRuleModel(Object.assign({}, r, {
          availableUsers: participants,
          availableGroupTags,
        })));
  }

  toDto() {
    return {
      projectId: this.projectId,
      page: this.page,
      pageSize: this.pageSize,
      taskIds: this.taskIds,
      assetTypes: this.assetTypes,
      projectUserLogicRules: this.projectUserLogicRules
        .filter(r => !r.isEmpty)
        .map(r => r.toDto()),
      createdAfter: cleanDate(this.createdAfter),
      createdBefore: cleanDate(this.createdBefore),
    };
  }

  @computedFrom(
    'projectUserLogicRules.length',
    'taskIds.length',
    'assetTypes.length',
    'createdAfter',
    'createdBefore',
  )
  get totalFilterCount() {
    return this.projectUserLogicRules.length +
      this.taskIds.length +
      this.assetTypes.length +
      (moment(this.createdAfter).isValid() ? 1 : 0) +
      (moment(this.createdBefore).isValid() ? 1 : 0);
  }
}

function cleanDate(date) {
  const mDate = moment(date);
  if (!mDate.isValid()) {
    return null;
  }

  return mDate.format('YYYY-MM-DD');
}
