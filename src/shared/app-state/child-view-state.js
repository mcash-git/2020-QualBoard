export class ChildViewState {
  constructor({
    sidebarOpen = false,
    sidebarViewModel = null,
    sidebarModel = null,
    actionBarViewModel = null,
    actionBarModel = null,
    fullHeight = false,
    actionBarClass = '',
  }) {
    this.sidebarOpen = sidebarOpen;
    this.sidebarViewModel = sidebarViewModel;
    this.sidebarModel = sidebarModel;
    this.actionBarViewModel = actionBarViewModel;
    this.actionBarModel = actionBarModel;
    this.fullHeight = fullHeight;
    this.actionBarClass = actionBarClass;
  }
}
