/* eslint-disable */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { withReadme }  from 'storybook-readme';

import InfiniteProgressBarReadme from './infinite-progress-bar.md';
import InfiniteProgressBar from 'shared/components/progress/infinite-progress-bar';

const progress = storiesOf('Progress Bars', module);
progress.addDecorator(withKnobs);

progress.add('Infinite-Progress', withReadme([InfiniteProgressBarReadme], () => {
  return (<InfiniteProgressBar
    width={text('width', '200px') }
    height={text('height', '5px') }
    lineColor={text('lineColor', '') }
    fillColor={text('fillColor', '')} />);
}));
