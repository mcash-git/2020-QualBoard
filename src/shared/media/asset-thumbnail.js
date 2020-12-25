import { bindable, computedFrom } from 'aurelia-framework';
import { AssetTypes } from '2020-media';

export class AssetThumbnail {
  static inject = [Element];

  constructor(element) {
    this.element = element;
  }

  @bindable asset;

  @bindable size;
  // OR
  @bindable width;
  @bindable height;

  assetChanged() {
    this.fileThumbnailLoaded = false;
    this.apiThumbnailLoaded = false;
  }

  handleFileImageLoad() {
    this.fileThumbnailLoaded = true;
  }

  handleFileImageError() {
    this.fileThumbnailLoaded = false;
    this.fileThumbnailErrored = true;
  }

  handleApiImageLoad() {
    this.apiThumbnailLoaded = true;
  }

  handleApiImageError() {
    this.apiThumbnailAvailable = false;
    this.apiThumbnailErrored = true;
  }

  @computedFrom('asset', 'asset.id', 'asset.type', 'size', 'height', 'width')
  get apiSrc() {
    const query = this.size ? `s=${this.size}` :
      `${this.height ? `h=${this.height}` : ''}${this.width ? `w=${this.width}` : ''}`;

    return `${this.asset.thumbnailUrl}?${query}`;
  }

  @computedFrom('size', 'height', 'width')
  get css() {
    return this.size ? `height:${this.size}px;width:${this.size}px;` :
      `${this.height ? `height:${this.height}px;` : ''}${
        this.width ? `width:${this.width}px` : ''}`;
  }

  @computedFrom('asset', 'asset.type')
  get assetType() {
    return AssetTypes[this.asset.type].value.toLowerCase();
  }

  @computedFrom('asset', 'asset.imageDataUrl')
  get dataUrl() {
    if (!this.asset.imageDataUrl) {
      return null;
    }

    return this.asset.imageDataUrl;
  }
}
