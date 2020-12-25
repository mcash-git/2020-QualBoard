import { computedFrom, bindable, bindingMode } from 'aurelia-framework';
import { MediaClient, AssetTypes } from '2020-media';

export class MediaItemThumbnail {
  static inject = [Element, MediaClient];
  
  constructor(element, mediaClient) {
    this.element = element;
    this.mediaClient = mediaClient;
  }
  
  @bindable({ defaultBindingMode: bindingMode.twoWay }) mediaItem;

  @bindable({ defaultBindingMode: bindingMode.oneWay }) size;
  // OR
  @bindable({ defaultBindingMode: bindingMode.oneWay }) width;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) height;

  mediaItemChanged(newValue, oldValue) {
    if (newValue && oldValue && oldValue.thumbnailUrl === newValue.thumbnailUrl) {
      // This fixes a bug where if the same view-model is swapped out with a copy
      // of itself, it was showing the loader indefinitely from these flags changing
      return;
    }
    this.imageLoaded = false;
    this.imageErrored = false;
  }

  handleError() {
    if (this.generatedThumbnailUrl) {
      this.imageErrored = true;
    }
    const generatedThumbnailUrl =
      this.mediaClient.generatedThumbnailLookup.get(this.mediaItem.assetId);
    if (generatedThumbnailUrl) {
      this.generatedThumbnailUrl = generatedThumbnailUrl;
    } else {
      this.imageErrored = true;
    }
  }

  handleLoad() {
    this.imageLoaded = true;
  }
  
  @computedFrom('mediaItem.viewable', 'imageLoaded', 'imageErrored')
  get thumbnailType() {
    if (this.mediaItem.viewable) {
      if (this.imageLoaded) { return 'image'; }
      if (this.imageErrored) { return 'error'; }
      return 'loading';
    }
    
    return 'download';
  }

  @computedFrom(
    'size',
    'height',
    'width',
    'mediaItem.assetId',
    'mediaItem.viewable',
    'generatedThumbnailUrl',
  )
  get src() {
    if (this.generatedThumbnailUrl) {
      return this.generatedThumbnailUrl;
    }
    if (this.mediaItem.viewable) {
      const query = this.size ? `s=${this.size}` :
        `${this.height ? `h=${this.height}` : ''}${this.width ? `w=${this.width}` : ''}`;
      return `${this.mediaItem.thumbnailUrl}?${query}`;
    }

    return '';
  }

  @computedFrom('mediaItem', 'mediaItem.type')
  get type() {
    return AssetTypes[this.mediaItem.type].value;
  }
}
