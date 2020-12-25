/* eslint-disable */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { withReadme }  from 'storybook-readme';

import MediaItemsReadme from './media-items.md';
import MediaItems from 'shared/components/media/media-items';

import MediaItemReadme from './media-item.md';
import MediaItem from 'shared/components/media/media-item';
import generateMediaItems from '../../../test/utility/generate-media-items';

const mediaItemsStories = storiesOf('Media/Media-Items', module);
mediaItemsStories.addDecorator(withKnobs);

const mockMediaItems = generateMediaItems(5);

mediaItemsStories.add('Media-Item', withReadme([MediaItemsReadme], () => {
  return (<MediaItem
    mediaItem={mockMediaItems[0]}
    viewMediaItem={action('media item clicked')}
  />);
}));

mediaItemsStories.add('Media-Items', withReadme([MediaItemsReadme], () => (
  <MediaItems
    mediaItems={mockMediaItems}
    viewMediaItem={action('media item clicked')}
  />
)));
