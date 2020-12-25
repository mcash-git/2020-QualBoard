// TODO:  Fix issue with newly uploaded media items having invalid date
// TODO:  Show cancel button if the upload hasn't started yet

import { computedFrom, bindable } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { MediaClient, AssetTypes } from '2020-media';
import { CurrentUser } from 'shared/current-user';

export class AssetDetails {
  static inject = [Element, DialogService, MediaClient, CurrentUser];

  constructor(element, modalService, mediaClient, user) {
    this.element = element;
    this.modalService = modalService;
    this.mediaClient = mediaClient;
    this.user = user;
  }

  @bindable asset;
  @bindable selectedAssets;

  async confirmDelete(event) {
    event.stopPropagation();

    this.modalService.open({
      viewModel: 'shared/components/confirmation-modal',
      model: {
        text: 'Are you sure you want to delete this media from the system?',
        title: 'Delete Confirmation',
        confirmButtonClass: 'btn-danger',
        confirmButtonText: 'Delete',
        cancelButtonClass: 'btn-outline-secondary',
      },
    }).whenClosed(result => {
      if (result.wasCancelled) {
        return;
      }

      this.element.dispatchEvent(new CustomEvent('delete-asset', {
        bubbles: true,
        detail: { assetId: this.asset.id },
      }));
    });
  }

  cancelUpload(event) {
    event.stopPropagation();

    this.element.dispatchEvent(new CustomEvent('cancel-asset-upload', {
      bubbles: true,
      detail: { assetId: this.asset.id },
    }));
  }

  download(event) {
    event.stopPropagation();
    this.mediaClient.downloadAsset(this.asset.id);
  }

  assetClick(e) {
    const shouldIgnore = e.target.closest('.checker') ||
      e.target.closest('.media-detail-action-container');

    if (shouldIgnore) {
      return true;
    }

    this.element.dispatchEvent(new CustomEvent('asset-click', {
      bubbles: true,
      detail: { clickedElement: e.target },
    }));

    return false;
  }

  @computedFrom('asset.type')
  get iconClass() {
    const type = AssetTypes[this.asset.type].value.toLowerCase();
    return type === 'video' ?
      'icon-videocam' :
      'icon-photo';
  }

  @computedFrom('selectedAssets.length')
  get isSelected() {
    return this.selectedAssets.indexOf(this.asset) !== -1;
  }

  @computedFrom('asset.name', 'asset.fileName')
  get name() {
    return this.asset.name || this.asset.fileName || '(untitled)';
  }

  @computedFrom('asset.type')
  get isVideo() {
    return AssetTypes[this.asset.type].value === 'Video';
  }
}
