import { bindable, computedFrom } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { enums } from '2020-qb4';

const PromptTypes = enums.promptTypes;

export class TaskLogicSummary {
  static inject = [DialogService];
  
  constructor(dialogService) {
    this.dialogService = dialogService;
  }
  
  @bindable task;
  @bindable availableTasks;
  ruleCount = 0;
  
  bind() {
    if (!this.masterRuleSet) {
      return;
    }
    
    this._countRules();
    this.isEnabled = this.availableTasks
      .filter(task => task.sortOrder < this.task.sortOrder && task.type !== PromptTypes.notice.int)
      .length > 0;
  }
  
  openModal() {
    if (!this.isEnabled) {
      return;
    }
    
    this.dialogService.open({
      viewModel: 'shared/components/logic-builder/logic-builder-modal',
      model: {
        masterRuleSet: this.masterRuleSet,
        type: 'task',
        availableItems: {
          tasks: this.availableTasks.filter(task => task.sortOrder < this.task.sortOrder),
        },
      },
    }).whenClosed(result => {
      if (result.wasCancelled) {
        return;
      }
      this.task.masterLogicRuleSetTasks = result.output;
      this._countRules();
    });
  }
  
  _countRules() {
    this.ruleCount = this.masterRuleSet.ruleSets.reduce((count, ruleSet) => {
      ruleSet.rules.filter(r => !r.isEmpty).forEach(() => count++);
      return count;
    }, 0);
  }
  
  @computedFrom('task.masterLogicRuleSetTasks')
  get masterRuleSet() {
    return this.task.masterLogicRuleSetTasks;
  }
  
  @computedFrom('ruleCount')
  get hasRules() {
    return this.ruleCount > 0;
  }
  
  @computedFrom('isEnabled')
  get tooltipText() {
    return this.isEnabled ? '' : 'There are no preceding tasks that can be used for logic rules.';
  }
}
