import { bindable } from 'aurelia-framework';

export class LogicRule {
  @bindable rule;
  @bindable availableSubjectGroups;
  
  bind() {
    if (!this.rule || !this.rule.subject) {
      return;
    }
    
    this._replaceDefaultRuleWithPopulatedOne();
  }
  
  _replaceDefaultRuleWithPopulatedOne() {
    const groupAndIndex = this.availableSubjectGroups.reduce((out, sg) => {
      if (out !== null) {
        return out;
      }
    
      const index = sg.subjects
        .findIndex(s => s.task === this.rule.subject.task && s.name === this.rule.subject.name);
    
      if (index !== -1) {
        return { group: sg, index };
      }
    
      return null;
    }, null);
  
    if (!groupAndIndex) {
      throw new Error('Unable to locate the logic rule subject in the available subject groups.');
    }
  
    const { group, index } = groupAndIndex;
  
    group.subjects.splice(index, 1, this.rule.subject);
  }
}
