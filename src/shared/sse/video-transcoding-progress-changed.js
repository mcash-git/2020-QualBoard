

export class VideoTranscodingProgressChanged {
  constructor({
    assetId = '',
    progress = 0,
  } = {}) {
    this.assetId = assetId;
    this.progress = progress;
  }
}
