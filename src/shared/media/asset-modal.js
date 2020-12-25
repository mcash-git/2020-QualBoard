import { ViewState } from 'shared/app-state/view-state';

export class MediaItemModal {
  static inject = [ViewState];

  constructor(viewState) {
    this.viewState = viewState;
  }

  activate(model) {
    this.asset = model.asset;
  }

  pausePlayer() {
    if (this.player) {
      this.player.pause();
    }
  }

  viewImage() {
    window.open(this.asset.dataUrl || this.asset.url, '_blank');
  }

  close() {
    this.viewState.closeModal();
  }
}
