import { computedFrom, bindable, bindingMode } from 'aurelia-framework';
import dragula from 'dragula';
import { enums } from '2020-qb4';
import { createGuid } from 'shared/utility/create-guid';

const PromptTypes = enums.promptTypes;

function createNewOption(focus) {
  return {
    optionId: createGuid(), groupTagObjects: [], groupTags: [], focus,
  };
}

export class EditMcma {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) task;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) availableGroupTags;

  constructor() {
    this.dragApi = dragula({
      moves: (el, container, handle) =>
        this.task.canEdit && handle.matches('i.handle'),
      revertOnSpill: true,
    });

    this.trackDrag(this.dragApi);
  }

  activate(model) {
    this.task = model.task;
    this.availableGroupTags = model.availableGroupTags;
  }

  attached() {
    if (this.task.options === undefined || this.task.options.length === 0) {
      this.task.options = [createNewOption()];
    }
    this.dragApi.containers = [this.dragContainer];
  }

  trackDrag(dragApi) {
    dragApi.on('drop', (el, target, source, sibling) => {
      dragApi.cancel();
      const moveFromIndex = el.index;

      // When moving to the end of the options, `sibling` will be null
      let moveToIndex = sibling ? sibling.index : -1;

      const option = this.task.options.splice(moveFromIndex, 1)[0];

      if (moveToIndex === -1) {
        this.task.options.push(option);
      } else {
        // If we are moving it forward, we've already removed the item and
        // must adjust.
        if (moveToIndex > moveFromIndex) {
          moveToIndex--;
        }
        this.task.options.splice(moveToIndex, 0, option);
      }
    });
  }

  addOptionAfterIndex(index) {
    if (!this.task.canEdit) {
      return;
    }
    this.task.options.splice(index + 1, 0, createNewOption(true));
  }

  deleteOptionAtIndex(index) {
    if (!this.task.canEdit) {
      return;
    }
    this.task.options.splice(index, 1);

    // we always want to have an option to edit.
    if (this.task.options.length === 0) {
      this.task.options.push(createNewOption(true));
    }
  }

  keyUp(event, index) {
    if (event.keyCode !== 13) {
      return;
    }

    this.addOptionAfterIndex(index);
  }

  @computedFrom('task', 'task.type')
  get optionsHeader() {
    return `${PromptTypes[this.task.type].friendly} Options:`;
  }
}
