import { LogicEngineRuleModel } from 'shared/models/logic-engine-rule-model';

export class AnalyticsSettingsModel {
  constructor({
    externalProjectId = null,
    name = null,
    conceptCount = 3,
    keywordCount = 8,
    verbatimCount = 20,
    promptIds = [],
    userIds = [],
    startAt = null,
    endAt = null,
    
    // non-DTO fields
    availableGroupTags = [],
    participants = [],
    projectUserLogicRules = [],
  } = {}) {
    this.externalProjectId = externalProjectId;
    this.name = name;
    this.conceptCount = conceptCount;
    this.keywordCount = keywordCount;
    this.verbatimCount = verbatimCount;
    this.promptIds = promptIds;
    this.userIds = userIds;
    this.startAt = startAt;
    this.endAt = endAt;
    
    this.availableGroupTags = availableGroupTags;
    this.participants = participants;
    
    this.projectUserLogicRules = projectUserLogicRules
      .map(r => new LogicEngineRuleModel(Object.assign({}, r, {
        availableUsers: participants,
        availableGroupTags,
      })));
  }
  
  toDto() {
    return {
      externalProjectId: this.externalProjectId,
      name: this.name,
      conceptCount: this.conceptCount,
      verbatimCount: this.verbatimCount,
      keywordCount: this.keywordCount,
      promptIds: this.promptIds,
      userIds: this.userIds,
      startAt: this.startAt,
      endAt: this.endAt,
    };
  }
  
  toSessionStorage() {
    const o = this.toDto();
    o.projectUserLogicRules = this.projectUserLogicRules.map(r => r.toDto());
    return o;
  }
}
