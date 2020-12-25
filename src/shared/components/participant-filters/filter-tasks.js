import { bindable, bindingMode } from 'aurelia-framework';
import { CheckboxTreeModel } from 'shared/models/checkbox-tree-model';

export class FilterTasks {
  @bindable({ defaultBindingMode: bindingMode.oneWay }) taskIds;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) individualActivities;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) title;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) isExpanded;

  @bindable({ defaultBindingMode: bindingMode.oneTime })
  expandedSessionStorageKey;

  activate(model) {
    this.title = model.title || 'Individual Activities / Tasks';
    this.isExpanded = model.isExpanded;
    this.taskIds = model.taskIds;
    this.individualActivities = model.individualActivities;

    this.individualActivitiesChanged(this.individualActivities);
  }

  individualActivitiesChanged(newValue) {
    if (!newValue || newValue.length === 0) {
      return;
    }

    this.iaCheckboxTrees = newValue.map(ia => new CheckboxTreeModel({
      text: ia.privateName,
      isExpanded: this.isExpanded,
      children: ia.tasks.map(task => new CheckboxTreeModel({
        text: task.title,
        value: task.id,
      })),
    }));
  }
}
