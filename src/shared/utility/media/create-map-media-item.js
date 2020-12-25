import getAssetUrls from 'shared/utility/media/get-asset-urls';

export default function createMapMediaItem(appConfig) {
  return (mediaItem) => {
    const { url, thumbnailUrl } = getAssetUrls({
      id: mediaItem.assetId,
      type: mediaItem.type,
    }, appConfig.media.baseUrl, appConfig.media.imageUriBase);

    return {
      ...mediaItem,
      thumbnailUrl,
      url,
      viewable: !!thumbnailUrl,
    };
  };
}
