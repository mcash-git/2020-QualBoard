import { computedFrom, bindable, bindingMode } from 'aurelia-framework';


export class AttachedMediaItem {
  static inject = [Element];

  constructor(element) {
    this.element = element;
  }

  @bindable({ defaultBindingMode: bindingMode.oneWay }) mediaItem;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) canEdit;

  removeItem(event) {
    event.stopPropagation();
    this.element.dispatchEvent(new CustomEvent('remove-media-item', {
      bubbles: true,
      detail: { mediaItem: this.mediaItem },
    }));
  }

  cancelUpload(event) {
    event.stopPropagation();
    this.element.dispatchEvent(new CustomEvent('cancel-upload', {
      bubbles: true,
      detail: { mediaItem: this.mediaItem },
    }));
  }

  @computedFrom('mediaItem.asset.uploadStatus')
  get thumbnailClass() {
    if (!this.mediaItem || !this.mediaItem.asset) {
      return '';
    }

    switch (this.mediaItem.asset.uploadStatus) {
      case 'started':
        return 'is-uploading';
      case 'cancelled':
        return 'cancelled';
      default:
        return '';
    }
  }
  
  @computedFrom('mediaItem.insightBags.length')
  get numInsights() {
    return this.mediaItem.insightBags.length;
  }
}
