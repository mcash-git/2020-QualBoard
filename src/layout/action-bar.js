import { BindingEngine, computedFrom } from 'aurelia-framework';
import { ViewState } from 'shared/app-state/view-state';
import get from 'lodash.get';

export class ActionBar {
  static inject = [Element, ViewState, BindingEngine];

  constructor(element, state, bindingEngine) {
    this.element = element;
    this.stack = state.childStateStack;
    this.bindingEngine = bindingEngine;
  }

  attached() {
    this.cssClassObserver =
      this.bindingEngine.expressionObserver(this, 'stack.current.actionBarClass');

    this.cssClassChangeSubscription =
      this.cssClassObserver.subscribe(this._handleCssClassChanged.bind(this));

    const currentClass = get(this, 'stack.current.actionBarClass');

    if (currentClass && this.element) {
      this.element.classList.add(currentClass);
    }
  }

  unbind() {
    if (this.cssClassChangeSubscription) {
      this.cssClassChangeSubscription.dispose();
    }
  }

  _handleCssClassChanged(newVal, oldVal) {
    if (oldVal) {
      this.element.classList.remove(oldVal);
    }
    if (newVal) {
      this.element.classList.add(newVal);
    }
  }

  @computedFrom('stack.current.actionBarViewModel')
  get viewModel() {
    return this.stack.current ? this.stack.current.actionBarViewModel : '';
  }

  @computedFrom('stack.current.actionBarModel')
  get model() {
    return this.stack.current ? this.stack.current.actionBarModel : '';
  }

  @computedFrom('stack.current')
  get shouldShow() {
    return !!this.stack.current;
  }
}
