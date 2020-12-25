import { computedFrom, bindable, bindingMode } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import Drop from 'tether-drop';
import hoverIntent from 'hoverintent';
import { CellGroupTagsModel } from 'shared/models/task-model';

export class MatrixTagCell {
  static inject = [Element, DialogService];

  constructor(element, modalService) {
    this.element = element;
    this.modalService = modalService;
  }

  @bindable({ defaultBindingMode: bindingMode.oneWay }) columnId;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) rowId;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) task;

  activate(model) {
    this.columnId = model.columnId;
    this.rowId = model.rowId;
    this.task = model.task;
    this.matrixGroupTags = this.task.matrixGroupTags;
    this.cellGroupTags = this.task.matrixGroupTags
      .find(t => t.rowId === this.rowId && t.columnId === this.columnId);
  }

  taskChanged(newValue) {
    this.matrixGroupTags = newValue.matrixGroupTags;
    this.cellGroupTags = this.task.matrixGroupTags
      .find(t => t.rowId === this.rowId && t.columnId === this.columnId);
  }

  attached() {
    // TODO:  Check if the config can be changed after initialization and
    // actually change behavior.

    this.dropConfig = {
      target: this.anchorElement,
      content: this.dropBody,
      remove: false,
      openOn: null,
      position: 'bottom center',
      constrainToWindow: true,
      classes: 'drop-theme-filters',
    };

    this.drop = new Drop(this.dropConfig);

    hoverIntent(this.anchorElement, () => {
      if (!this.cellGroupTags || !this.cellGroupTags.groupTagObjects ||
        this.cellGroupTags.groupTagObjects.length === 0) {
        this.canForegoDropClose = true;
        return;
      }

      this.canForegoDropClose = false;
      this.drop.open();
    }, () => {
      if (this.canForegoDropClose) {
        return;
      }
      this.drop.close();
    });
  }

  handleAnchorClick() {
    if (!this.cellGroupTags) {
      this.cellGroupTags = new CellGroupTagsModel({
        rowId: this.rowId,
        columnId: this.columnId,
        availableGroupTags: this.task.availableGroupTags,
      });

      this.matrixGroupTags.push(this.cellGroupTags);
    }

    this.modalService.open({
      viewModel: 'researcher/individual-activity/edit/tasks/matrix/matrix-tag-modal',
      model: { cellGroupTags: this.cellGroupTags, task: this.task },
    });
  }

  @computedFrom('cellGroupTags.groupTagObjects.length')
  get cellText() {
    const count =
      !this.cellGroupTags || !this.cellGroupTags.groupTagObjects ?
        0 :
        this.cellGroupTags.groupTagObjects.length;

    if (count === 0) {
      return '-';
    }

    return `${count} Tag${count === 1 ? '' : 's'}`;
  }
}
