import { bindable, bindingMode } from 'aurelia-framework';
import { MediaClient } from '2020-media';
import { ViewState } from '../app-state/view-state';

export class MediaUploadArea {
  static inject = [Element, ViewState, MediaClient];

  constructor(element, viewState, mediaClient) {
    this.element = element;
    this.viewState = viewState;
    this.mediaClient = mediaClient;
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) selectedAssets;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) currentPage;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) assetScope;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) canSelectMultiple;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) canClickToUpload = true;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) mode;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) onBeforeUpload;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) accountId;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) projectId;
  files = [];

  handleClick(event) {
    if (this.canClickToUpload) {
      this.openFileDialog(event);
    }
  }

  openFileDialog(event) {
    event.stopPropagation();
    this.mediaUploader.openFileDialog();
  }

  assetClicked(event, asset) {
    if (event.target.closest('.media-detail-action-container')) {
      return true;
    }

    if (this.mode === 'select' || event.target.closest('.checker')) {
      this.toggleSelected(event, asset);
      return false;
    }

    if (/^application/i.test(asset.mimeType)) {
      this.mediaClient.downloadAsset(asset.id);
    } else {
      this.viewState.openModal('shared/media/asset-modal', { asset });
    }

    return false;
  }

  toggleSelected(event, asset) {
    event.stopPropagation();
    const index = this.selectedAssets.indexOf(asset);
    if (index === -1) {
      if (this.canSelectMultiple) {
        // multiple is enabled, so just push this selection on.
        this.selectedAssets.push(asset);
      } else {
        // multiple is not enabled so deselect all the others.
        this.selectedAssets.forEach(a => { a.isSelected = false; });
        this.selectedAssets = [asset];
      }
      asset.isSelected = true;
    } else {
      const [removed] = this.selectedAssets.splice(index, 1);
      removed.isSelected = false;
    }
  }

  handleUploadStarted(assets) {
    this.element.dispatchEvent(new CustomEvent('select-page', {
      bubbles: true,
      detail: { pageNumber: 1, uploadingAssets: assets },
    }));
  }

  handleBeforeUpload(fileList) {
    // check if any files are not supported and remove them, then alert user
    if (this.onBeforeUpload && typeof this.onBeforeUpload === 'function') {
      this.onBeforeUpload({ fileList });
    }
  }

  handleDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  handleDragLeave(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  handleDrop(event) {
    event.stopPropagation();
    event.preventDefault();

    this.mediaUploader.handleDataTransferItems(event.dataTransfer.items);
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  get hasFocus() {
    return !!document.activeElement.closest('media-upload-area');
  }
}
