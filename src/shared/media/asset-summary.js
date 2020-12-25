import { computedFrom, bindable, bindingMode } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { MediaClient, AssetTypes } from '2020-media';

export class AssetSummary {
  static inject = [Element, DialogService, MediaClient];

  constructor(element, modalService, mediaClient) {
    this.element = element;
    this.modalService = modalService;
    this.mediaClient = mediaClient;
  }

  @bindable({ defaultBindingMode: bindingMode.oneWay }) asset;

  confirmDelete(event) {
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

  @computedFrom('asset', 'asset.type')
  get iconClass() {
    const type = AssetTypes[this.asset.type].value;

    // TODO:  Support other media types here.
    return type === 'Video' ? 'icon-videocam' : 'icon-photo';
  }
}
