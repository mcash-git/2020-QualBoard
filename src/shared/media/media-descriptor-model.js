import { AssetTypes } from '2020-media';
import { computedFrom } from 'aurelia-framework';

export class MediaDescriptorModel {
  static AssetTypes = AssetTypes;

  static fromAsset(asset) {
    return new MediaDescriptorModel({
      assetId: asset.id,
      type: asset.type,
      asset,
      mediaApiUrl: asset.config.baseUrl,
      imageUriBase: asset.config.imageUriBase,
      fileName: asset.fileName,
    });
  }

  constructor({
    assetId = null,
    type = null,
    title = null,
    description = null,
    fileName = null,
    asset = null,

    mediaApiUrl = null,
    imageUriBase = null,
    insightBags = [],
  } = {}) {
    this.assetId = assetId;
    this.type = type;
    this.title = title;
    this.fileName = fileName;
    this.description = description;
    this.asset = asset;
    this.mediaApiUrl = mediaApiUrl;
    this.imageUriBase = imageUriBase;
    this.insightBags = insightBags;
  }

  fileName = null;

  toDto() {
    return {
      assetId: this.assetId,
      type: this.type,
      title: this.title,
      description: this.description,
      fileName: this.fileName,
    };
  }

  insertInsightSorted(insight) {
    insertInsightSorted(insight, this.insightBags);
  }

  sortInsights() {
    const insights = [];

    this.insightBags.forEach(ic => {
      insertInsightSorted(ic, insights);
    });

    this.insightBags = insights;
  }

  @computedFrom('type')
  get url() {
    switch (AssetTypes[this.type].value) {
      case 'Image':
        return this.imageUrl;
      case 'Video':
        return this.videoUrl;
      default:
        return `${this.mediaApiUrl}/assets/${this.assetId}/download`;
    }
  }

  @computedFrom('url')
  get viewable() {
    const type = AssetTypes[this.type].value;
    return type === 'Video' || type === 'Image';
  }

  get thumbnailUrl() {
    switch (AssetTypes[this.type].value) {
      case 'Image':
        return this.imageUrl;
      case 'Video':
        return `${this.imageUriBase}/video/${this.assetId}/thumb`;
      default:
        return null;
    }
  }

  get imageUrl() {
    return `${this.imageUriBase}/image/${this.assetId}`;
  }

  get videoUrl() {
    return `${this.mediaApiUrl}/video/${this.assetId}`;
  }
}

function insertInsightSorted(insight, insights) {
  let index = 0;
  while (index < insights.length &&
  compareInsightsByStartTime(insight, insights[index]) > 0) {
    index++;
  }
  insights.splice(index, 0, insight);
}

// TODO:  refactor all insight comparison into a utility method that can be used everywhere
// TODO:  When we have image insights, this sorting will need to differ.
function compareInsightsByStartTime(a, b) {
  return (a.start || 0) - (b.start || 0);
}
