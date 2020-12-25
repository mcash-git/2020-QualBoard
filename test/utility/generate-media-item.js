import { createGuid } from 'shared/utility/create-guid';
import random from 'lodash.random';

const testVideoUrl = 'http://sample-videos.com/video/mp4/360/big_buck_bunny_360p_2mb.mp4';
const imageUrlBase = 'https://placehold.it/';

const generateMediaItem = ({
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  type,
}) => {
  const assetId = createGuid();
  const thumbnailUrl = `${imageUrlBase}${random(minWidth, maxWidth)}x${random(minHeight, maxHeight)}`;
  const url = (type === 2) ?
    testVideoUrl :
    thumbnailUrl;

  return {
    assetId,
    type,
    title: null,
    description: null,
    fileName: '',
    url,
    thumbnailUrl,
  };
};

export default generateMediaItem;
