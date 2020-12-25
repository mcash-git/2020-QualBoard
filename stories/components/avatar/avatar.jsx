/* eslint-disable */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { withReadme }  from 'storybook-readme';

import Avatar from 'shared/components/avatar/avatar';
import AvatarReadme from './avatar.md';

const avatar = storiesOf('Avatar', module);
avatar.addDecorator(withKnobs);

avatar.add('Default', withReadme([AvatarReadme],  () => (
  <Avatar
    identityServerUri={text('identityServerUri', 'https://alpha.2020identity.com/')}
    size={number('size', 100)}
  />
)));

avatar.add('User Id and Size',  withReadme([AvatarReadme], () => (
  <Avatar
    userId={text('userId', '7befd164-fe2a-4cfb-fa9d-08d41e21a1a3')}
    identityServerUri={text('identityServerUri', 'https://alpha.2020identity.com/')}
    size={number('size', 100)}
  />
)));

avatar.add('User Id and Width Height',  withReadme([AvatarReadme], () => (
  <Avatar
    userId={text('userId', '7befd164-fe2a-4cfb-fa9d-08d41e21a1a3')}
    identityServerUri={text('identityServerUri', 'https://alpha.2020identity.com/')}
    width={number('width', 100)}
    height={number('height', 100)}
  />
)));

// avatar.add('Email and Size', () => (
//   <Avatar
//     email={text('email', 'allenh@2020research.com')}
//     identityServerUri={text('identityServerUri', 'https://alpha.2020identity.com/')}
//     size={number('size', 100)}
//   />
// ));

export default avatar;
