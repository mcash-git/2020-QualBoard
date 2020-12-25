import { computedFrom, bindable, bindingMode } from 'aurelia-framework';

export class SavedTask {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) task;

  @computedFrom('task', 'task.type')
  get viewModel() {
    return this.task.savedViewModel;
  }
}
