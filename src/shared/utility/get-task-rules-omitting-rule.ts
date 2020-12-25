// "rules" param is the top-level array which contains only one rule, which contains the
// rule sets, which each contain the actual logic rules.
export default function getTaskRulesOmittingRule(rules:any[], omitRule:any) : any[] {
  if (!rules || rules.length === 0) {
    throw new Error('Unable to omit rule; task.taskLogicRules is empty');
  }

  let found = false;

  const resultTaskLogicRules = [{
    ...rules[0],
    rules: rules[0].rules.map(ruleSet => ({
      ...ruleSet,
      rules: ruleSet.rules.indexOf(omitRule !== -1) ?
        [...ruleSet.rules].filter(rule => {
          if (rule === omitRule) {
            found = true;
            return false;
          }
          return true;
        }) :
        rules,
    })).filter(ruleSet => ruleSet.rules.length > 0),
  }].filter(masterRuleSet => masterRuleSet.rules.length > 0);

  if (found === false) {
    throw new Error('Unable to omit rule; rule not found in rule set.');
  }

  return resultTaskLogicRules;
}
