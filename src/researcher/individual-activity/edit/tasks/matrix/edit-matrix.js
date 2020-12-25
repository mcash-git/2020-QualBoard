import { TaskQueue, bindable, bindingMode } from 'aurelia-framework';
import dragula from 'dragula';
import { enums } from '2020-qb4';
import { createGuid } from 'shared/utility/create-guid';

const PromptTypes = enums.promptTypes;

export class EditMatrix {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) task;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) availableGroupTags;
  tagCells = {};
  static inject = [TaskQueue];
  isGroupTagsVisible = true;

  constructor(taskQueue) {
    this.taskQueue = taskQueue;
    const dragulaConfig = {
      moves: (el, container, handle) => this.task.canEdit && handle.matches('i.handle'),
      revertOnSpill: true,
    };

    this.dragApiColumns = dragula(dragulaConfig);
    this.dragApiRows = dragula(dragulaConfig);
  }

  activate(model) {
    this.task = model.task;
    this.availableGroupTags = model.availableGroupTags;
  }

  attached() {
    this.trackDrag(this.dragApiColumns, this.task.matrixColumns);
    this.trackDrag(this.dragApiRows, this.task.matrixRows);

    if (this.task.matrixColumns.length === 0) {
      this.task.matrixColumns.push({ columnId: createGuid(), text: '' });
    }
    if (this.task.matrixRows.length === 0) {
      this.task.matrixRows.push({ rowId: createGuid(), text: '' });
    }
    this.dragApiColumns.containers = [this.dragContainerColumns];
    this.dragApiRows.containers = [this.dragContainerRows];
  }

  add(array, index) {
    if (!this.task.canEdit) {
      return;
    }
    const id = createGuid();
    const item = { focus: true, rowId: id, columnId: id };
    if (index === array.length - 1) {
      array.push(item);
    } else {
      array.splice(index + 1, 0, item);
    }
  }

  keyUp(event, array, index) {
    if (event.keyCode !== 13) {
      return;
    }

    this.add(array, index);
  }


  delete(array, index) {
    if (!this.task.canEdit) {
      return;
    }
    if (array.length === 1) {
      array.splice(index, 1, { focus: true });
    } else {
      array.splice(index, 1);
    }
  }

  trackDrag(dragApi, array) {
    dragApi.on('drop', (el, target, source, sibling) => {
      dragApi.cancel();
      if (!this.task.canEdit) {
        return;
      }
      const moveFromIndex = el.index;

      // When moving to the end of the options, `sibling` will be null
      let moveToIndex = sibling ? sibling.index : -1;

      const item = array.splice(moveFromIndex, 1)[0];
      if (moveToIndex === -1) {
        array.push(item);
      } else {
        // If we are moving it forward, we've already removed the item and
        // must adjust.
        if (moveToIndex > moveFromIndex) {
          moveToIndex--;
        }
        array.splice(moveToIndex, 0, item);
      }
    });
  }

  get optionsHeader() {
    return `${PromptTypes[this.task.type].friendly} Options:`;
  }
}
