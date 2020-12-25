export class LogicRuleSubjectModel {
  constructor({
    name = null,
    module = null,
    allowedOperators = null,
    operator = null,
  } = {}) {
    this.name = name;
    this.module = module;
    this.allowedOperators = allowedOperators;
    this.operator = operator;
  }
}
