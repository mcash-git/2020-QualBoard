import { computedFrom } from 'aurelia-framework';
import { assertClassType } from 'shared/utility/assert-class-type'; // eslint-disable-line

export class SafeStack {
  constructor(ClassType) {
    if (ClassType !== undefined && typeof ClassType !== 'function') {
      throw new Error('Cannot initialize SafeStack - "ClassType" must be a ' +
        'class or undefined.');
    }
    this.ClassType = ClassType;
    this._items = [];
  }

  push(state) {
    if (this.ClassType && state.constructor.name !== this.ClassType.name) {
      throw new Error(`Only instances of ${this.ClassType.name
      } can be pushed.`);
    }

    this._items.push(state);
  }

  pop() {
    this._items.pop();
  }

  @computedFrom('_items', '_items.length')
  get current() {
    return this._items[this._items.length - 1];
  }
}
