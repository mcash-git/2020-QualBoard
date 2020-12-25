export class LogicRuleSubjectOperator {
  constructor({
    subRuleOperator = null,
    ruleOperator = null,
    friendly = null,
  } = {}) {
    this.subRuleOperator = subRuleOperator;
    this.ruleOperator = ruleOperator;
    this.friendly = friendly;
  }
}
