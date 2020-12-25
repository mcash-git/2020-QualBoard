import { ViewState } from 'shared/app-state/view-state';

export class ActivityTasks {
  static inject = [ViewState];

  constructor(viewState) {
    this.viewState = viewState;
  }

  activate({ projectId, iaId }) {
    this.projectId = projectId;
    this.iaId = iaId;

    const childState = this.viewState.childStateStack.current;

    childState.fullHeight = true;
    childState.actionBarModel.subViewModel = null;
    childState.actionBarModel.subModel = null;
    childState.sidebarModel = null;
    childState.sidebarViewModel = null;
    childState.sidebarOpen = false;

    this.childState = childState;
  }

  attached() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
  }
}
