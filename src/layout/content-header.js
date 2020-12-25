import { computedFrom } from 'aurelia-framework';

import { ViewState } from 'shared/app-state/view-state';

export class ContentHeader {
  static inject = [ViewState];

  constructor(state) {
    this.stack = state.parentStateStack;
  }

  attached() {
    this.bgImg.classList.add('opaque');
  }

  @computedFrom('stack.current.shouldShowContentHeader')
  get shouldShowContentHeader() {
    return this.stack.current && this.stack.current.shouldShowContentHeader;
  }
}
