import { ViewState } from 'shared/app-state/view-state';

export class NotFound {
  static inject = [ViewState];

  constructor(viewState) {
    this.viewState = viewState;
  }

  goBack() {
    history.back();
  }

  goHome() {
    window.location = '/#/';
  }
}
