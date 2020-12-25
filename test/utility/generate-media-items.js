import random from 'lodash.random';
import generateMediaItem from './generate-media-item';

const generateMediaItems = (numToGenerate) => {
  const items = [];

  for (let i = 0; i < numToGenerate; i++) {
    items.push(generateMediaItem({
      minWidth: 400,
      maxWidth: 1200,
      minHeight: 400,
      maxHeight: 1200,
      type: random(1, 2),
    }));
  }

  return items;
};

export default generateMediaItems;
