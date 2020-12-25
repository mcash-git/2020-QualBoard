import { computedFrom } from 'aurelia-framework';
import { growlProvider } from 'shared/growl-provider';

// TODO:  We might want to switch away from using inheritance here.  It caused
// me problems (using inheritance) elsewhere in the app, so it may bite us here.
export class MediaGalleryBase {
  constructor(api, mediaClient) {
    this.api = api;
    this.mediaClient = mediaClient;
  }

  selectedAssets = [];

  selectAllChecked(event) {
    if (event.target.checked) {
      this.selectedAssets = this.currentPage.items.concat();
    } else {
      this.selectedAssets = [];
    }
  }

  selectAllLabelClick() {
    if (this.isSelectAllDisabled) {
      return;
    }
    this.selectAll = !this.selectAll;
    this.selectAllChecked({ target: { checked: this.selectAll } });
  }

  async handleDeleteAsset(event) {
    const success = await this.mediaClient.deleteAsset(event.detail.assetId);

    if (!success) {
      growlProvider.warning('Error', 'There was an error deleting your media. Please try again; if the problem persists, contact support.');
      return;
    }

    setTimeout(() => this.loadPage(1), 50);
  }

  async handleSelectPage(event) {
    setTimeout(async () => this.loadPage(event.detail.pageNumber), 50);
  }

  @computedFrom('selectedAssets.length')
  get numSelectedAssets() {
    if (!this.selectedAssets || !this.currentPage.items) {
      this.selectAll = false;
      return 0;
    }
    if (this.selectedAssets.length === this.currentPage.items.length &&
      this.selectedAssets.length !== 0) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }

    return this.selectedAssets.length;
  }

  @computedFrom('currentPage.items.length')
  get isSelectAllDisabled() {
    return this.currentPage.items.length === 0;
  }

  @computedFrom('selectedAssets', 'selectedAssets.length')
  get isSelecting() {
    return this.numSelectedAssets > 0;
  }
}
