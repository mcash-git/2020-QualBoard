import { computedFrom, BindingEngine } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ViewState } from 'shared/app-state/view-state';
import throttle from 'lodash.throttle';

export class Layout {
  static inject = [ViewState, EventAggregator, BindingEngine];

  constructor(viewState, ea, bindingEngine) {
    this.state = viewState;
    this.ea = ea;
    this.bindingEngine = bindingEngine;

    this.contentHeight = 0;
  }

  attached() {
    document.addEventListener('scroll', throttle(this.handleScroll.bind(this), 16));
    window.addEventListener('resize', throttle(this.handleResize.bind(this), 16));

    this.navigationSubscription = this.ea.subscribe('router:navigation:complete', () => {
      this.state.closeModal();
      this.handleResize.bind(this);
    });

    this.modalOpenObserver = this.bindingEngine.expressionObserver(this, 'state.modal');

    this.modalChangeSubscription =
      this.modalOpenObserver.subscribe(this.handleModalOpenChange.bind(this));

    this.handleResize();
  }

  detached() {
    this.navigationSubscription.dispose();
    this.modalChangeSubscription.dispose();
  }

  @computedFrom(
    'state.moderatorToolsOpen',
    'state.childStateStack.current.sidebarOpen',
    'state.sticky.active',
    'state.parentStateStack.current.shouldShowContentHeader',
    'state.sticky.tall',
  )
  get classes() {
    const classList = ['tt_qb_application-wrapper'];
    const childState = this.state.childStateStack.current || {};
    classList.push(this.state.moderatorToolsOpen ? 'left-sidebar-active' : 'left-sidebar-inactive');
    classList.push(childState.sidebarOpen ? 'right-sidebar-active' : 'right-sidebar-inactive');
    if (this.state.isStickyActive) {
      classList.push('sticky-active');
      classList.push(this.state.sticky.tall ? 'sticky-tall' : 'stick-short');
    }

    return classList.join(' ');
  }

  @computedFrom(
    'state.childStateStack.current.sidebarViewModel',
    'state.childStateStack.current.sidebarModel',
    'state.childStateStack.current.sidebarOpen',
  )
  get sidebar() {
    const childState = this.state.childStateStack.current || {};
    return {
      viewModel: childState.sidebarViewModel,
      model: childState.sidebarModel,
      open: childState.sidebarOpen,
    };
  }

  @computedFrom(
    'state.childStateStack.current.fullHeight',
    'contentHeight',
  )
  get contentStyle() {
    const childState = this.state.childStateStack.current || {};
    if (childState.fullHeight) {
      return { height: `${this.contentHeight}px` };
    }

    return {};
  }

  ignoreDomEvent(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleScroll() {
    const scrollPos = this.contentHeaderElement.getBoundingClientRect().bottom;
    const stickyHeight = this.state.sticky.tall ?
      this.state.tallStickyHeight :
      this.state.shortStickyHeight;
    const breakpoint = stickyHeight + this.state.appHeadHeight;

    this.state.sticky.active = scrollPos < breakpoint;
  }

  handleResize() {
    this.contentHeight = window.innerHeight - this.contentElement.getBoundingClientRect().top;
  }

  handleOutsideClick(event) {
    event.stopPropagation();
    this.state.closeModal();
    this.state.moderatorToolsOpen = false;
  }

  handleModalOpenChange() {
    document.body.style.overflow = this.state.modal ?
      'hidden' : '';
  }
}
