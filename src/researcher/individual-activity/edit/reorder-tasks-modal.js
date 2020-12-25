import { DialogController } from 'aurelia-dialog';
import { Api } from 'api/api';
// import { ModalController } from 'shared/modal/modal-controller';
import dragula from 'dragula';

export class ReorderTasksModal {
  static inject = [DialogController, Element, Api];
  // static inject = [ModalController];

  constructor(modalController, element, api) {
    this.modalController = modalController;
    this.element = element;
    this.api = api;
  }

  activate(model) {
    this.tasks = model.tasks;
    this.projectId = model.projectId;
    this.iaId = model.iaId;

    this.dragApi = dragula({
      revertOnSpill: true,
    });
  }

  attached() {
    this.dragApi.containers = [this.element.querySelector('.reorder-task-container')];

    this.trackDrag(this.dragApi);
  }

  trackDrag(dragApi) {
    dragApi.on('drop', (el, target, source, sibling) => {
      dragApi.cancel();
      const moveFromIndex = el.index;

      // When moving to the end of the options, `sibling` will be null
      let moveToIndex = sibling ? sibling.index : -1;

      const task = this.tasks.splice(moveFromIndex, 1)[0];

      if (moveToIndex === -1) {
        this.tasks.push(task);
      } else {
        // If we are moving it forward, we've already removed the item and
        // must adjust.
        if (moveToIndex > moveFromIndex) {
          moveToIndex--;
        }
        this.tasks.splice(moveToIndex, 0, task);
      }
    });
    const scrollDiv = this.element.querySelector('[ref="dragContainer"]');
    const mousemoveHandler = event => handleMousemove(event, scrollDiv);
    const escKeyHandler = event => {
      if (event.keyCode === 27) {
        dragApi.cancel(true);
      }
    };

    dragApi.on('drag', () => {
      if (scrollDiv.scrollHeight > scrollDiv.clientHeight) {
        document.body.addEventListener('mousemove', mousemoveHandler);
        document.body.addEventListener('keydown', escKeyHandler);
      }
    });

    dragApi.on('dragend', () => {
      document.body.removeEventListener('mousemove', mousemoveHandler);
      document.body.removeEventListener('keydown', escKeyHandler);
      stopAutoscroll();
    });
  }

  async reorder() {
    // Save the new order
    const result = await this.api.command.individualActivities.reorderTasks({
      projectId: this.projectId,
      iaId: this.iaId,
      taskOrder: this.tasks.map(t => t.id),
    });

    if (result.error) {
      return;
    }

    this.modalController.ok(this.tasks);
  }

  cancel() {
    this.modalController.cancel();
  }
}

// TODO:  Holy cow this is ugly.  Clean it up, refactor, etc...

let scrollInterval;
let scrollTimeoutId;

// Negative means we scroll up, positive means down.
let scrollDirection;
let lastThreshold;
let scrollMe;

function handleMousemove(event, scrollDiv) {
  // Determine the y position of the top of the scrollDiv
  // Determine the y position of the bottom of the scrollDiv.

  const divRectangle = scrollDiv.getBoundingClientRect();

  // Set up threshold y position locations.
  const upFastest = divRectangle.top;
  const upFaster = upFastest + 30;
  const upFast = upFaster + 30;
  const up = upFast + 30;

  const none = divRectangle.bottom - 90;

  const down = none + 30;
  const downFast = down + 30;
  const downFaster = divRectangle.bottom;
  const downFastest = Infinity;

  // Is y position of mouse in a threshold?
  const { y } = event;
  let currentThreshold;

  if (y <= upFastest) {
    // scroll up fastest
    scrollInterval = 10;
    scrollDirection = -1;
    currentThreshold = upFastest;
  } else if (y <= upFaster) {
    // scroll up faster
    scrollInterval = 25;
    scrollDirection = -1;
    currentThreshold = upFaster;
  } else if (y <= upFast) {
    // Scroll up fast
    scrollInterval = 50;
    scrollDirection = -1;
    currentThreshold = upFast;
  } else if (y <= up) {
    // Scroll up slowly
    scrollInterval = 125;
    scrollDirection = -1;
    currentThreshold = up;
  } else if (y <= none) {
    // No scrolling
    stopAutoscroll();
    currentThreshold = none;
    scrollDirection = 0;
    return;
  } else if (y <= down) {
    // Scroll down slowly
    scrollInterval = 125;
    scrollDirection = 1;
    currentThreshold = down;
  } else if (y <= downFast) {
    // Scroll down fast
    scrollInterval = 50;
    scrollDirection = 1;
    currentThreshold = downFast;
  } else if (y <= downFaster) {
    // Scroll down faster
    scrollInterval = 25;
    scrollDirection = 1;
    currentThreshold = downFaster;
  } else {
    // Scroll down fastest
    scrollInterval = 10;
    scrollDirection = 1;
    currentThreshold = downFastest;
  }

  // Is threshold different from the last threshold?
  if (currentThreshold === lastThreshold) {
    return;
  }

  lastThreshold = currentThreshold;
  // Stop race condition:

  startAutoscroll(scrollDiv);
}

function startAutoscroll(scrollDiv) {
  if (!scrollMe) {
    scrollMe = scrollDiv;
  }

  scrollTimeoutId = 1;
  doScroll();
}

function doScroll() {
  if (!scrollTimeoutId) {
    // We have been canceled!
    return;
  }

  scrollMe.scrollTop += (5 * scrollDirection);
  scrollTimeoutId = setTimeout(startAutoscroll, scrollInterval);
}

function stopAutoscroll() {
  clearTimeout(scrollTimeoutId);
  lastThreshold = null;
  scrollTimeoutId = null;
  scrollMe = null;
}
