export class LogicRuleSubjectGroupModel {
  constructor({
    subjects = [],
    title = null,
  } = {}) {
    this.subjects = subjects;
    this.title = title;
  }
}
