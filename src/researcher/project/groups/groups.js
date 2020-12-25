import { ViewState } from 'shared/app-state/view-state';

export class Groups {
  static inject = [ViewState];

  constructor(viewState) {
    this.viewState = viewState;
  }

  canActivate(params) {
    this.projectId = params.projectId;
  }

  deactivate() {
    this.viewState.childStateStack.pop();
  }
}
