/* eslint-disable */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { withReadme }  from 'storybook-readme';

import Badge from 'shared/components/badges/badge';
import BadgesReadme from './badges.md';

const badge = storiesOf('Badges', module);
badge.addDecorator(withKnobs);

badge.add('Round Badge', withReadme([BadgesReadme], () => (
  <Badge
    badgeClass={text('badge-class', '')}
    number={number('number', 7)}
  />
)));

badge.add('Selected Badge', withReadme([BadgesReadme], () => (
  <Badge
    badgeClass={text('badge-class', 'selected')}
    number={number('number', 7)}
  />
)));

export default badge;