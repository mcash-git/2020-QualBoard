import { bindable, computedFrom } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';

export class UserLogicSummary {
  static inject = [DialogService];
  
  constructor(dialogService) {
    this.dialogService = dialogService;
  }
  
  @bindable task;
  @bindable availableGroupTags;
  @bindable availableUsers;
  ruleCount = 0;
  
  bind() {
    if (!this.masterRuleSet) {
      return;
    }
    
    this._countRules();
  }
  
  openModal() {
    this.dialogService.open({
      viewModel: 'shared/components/logic-builder/logic-builder-modal',
      model: {
        masterRuleSet: this.masterRuleSet,
        type: 'user',
        availableItems: {
          users: this.availableUsers,
          tags: this.availableGroupTags,
        },
      },
    }).whenClosed(result => {
      if (result.wasCancelled) {
        return;
      }
      this.task.masterLogicRuleSetUsers = result.output;
      this._countRules();
    });
  }
  
  _countRules() {
    this.ruleCount = this.masterRuleSet.ruleSets.reduce((count, ruleSet) => {
      ruleSet.rules.filter(r => !r.isEmpty).forEach(() => count++);
      return count;
    }, 0);
  }
  
  @computedFrom('task.masterLogicRuleSetUsers')
  get masterRuleSet() {
    return this.task.masterLogicRuleSetUsers;
  }
  
  @computedFrom('ruleCount')
  get hasRules() {
    return this.ruleCount > 0;
  }
}
