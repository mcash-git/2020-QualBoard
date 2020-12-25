import animate from 'amator';
import { computedFrom } from 'aurelia-framework';
import get from 'lodash.get';

export class ViewState {
  static inject = ['ParentStateStack', 'ChildStateStack'];

  constructor(parentStateStack, childStateStack, ea) {
    this.ea = ea;

    this.moderatorToolsOpen = false;
    this.sticky = {
      active: false,
      tall: true,
    };

    this.modal = null;

    this.parentStateStack = parentStateStack;
    this.childStateStack = childStateStack;
  }

  // These must be edited in conjunction with _layout.scss
  leftSidebarWidth = 350;
  rightSidebarWidth = 350;
  appHeadHeight = 40;
  shortStickyHeight = 40;
  tallStickyHeight = 85;
  actionBarHeight = 42;
  scrollToBuffer = 5;

  scrollIntoView(el, duration) {
    if (!el) { throw new Error('Element is required in scrollIntoView'); }

    const doScroll = scrollingParent => {
      if (!scrollingParent) {
        throw new Error('Element is not attached to the DOM in scrollIntoView');
      }

      const headerHeight = this.appHeadHeight + this.shortStickyHeight + this.actionBarHeight;

      const rect = el.getBoundingClientRect();
      const scrollDiff = rect.top - headerHeight;
      const scrollTop = scrollingParent.scrollTop + scrollDiff;

      animate(scrollingParent, {
        scrollTop,
      }, { duration });
    };
    doScroll(document.documentElement);
    doScroll(document.body);
  }

  openModal(viewModel, model) {
    this.modal = {
      viewModel,
      model,
    };
  }

  closeModal() {
    this.modal = null;
  }

  @computedFrom('parentStateStack.current.shouldShowContentHeader', 'sticky.active')
  get isStickyActive() {
    return !get(this, 'parentStateStack.current.shouldShowContentHeader') || this.sticky.active;
  }
}
