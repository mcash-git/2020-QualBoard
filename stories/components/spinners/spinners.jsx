/* eslint-disable */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { withReadme } from 'storybook-readme';

import RollingSpinnerReadme from './rolling-spinner.md';
import RollingSpinner from 'shared/components/spinners/rolling-spinner';

const spinners = storiesOf('Spinners', module);
spinners.addDecorator(withKnobs);

spinners.add('Rolling Spinner', withReadme([RollingSpinnerReadme], () => {
  return (<RollingSpinner
    size={text('size', '75px')}
    color={text('color', '')}
    speed={text('speed', '')}
    margin={text('margin', '')}
    display={text('display', '')}
  />);
}));
