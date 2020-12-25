import { AssetTypes } from '2020-media';

const getAssetUrls = ({ type, id }, mediaApiBaseUrl, imageUriBase) => {
  const assetType = AssetTypes[type].value;
  let url;

  switch (assetType) {
    case 'Image':
      url = `${imageUriBase}/image/${id}`;
      return { url, thumbnailUrl: url };
    case 'Video':
      url = `${mediaApiBaseUrl}/video/${id}`;
      return { url, thumbnailUrl: `${imageUriBase}/video/${id}/thumb` };
    default:
      url = `${mediaApiBaseUrl}/assets/${id}/download`;
      return { url, thumbnailUrl: null };
  }
};

export default getAssetUrls;
