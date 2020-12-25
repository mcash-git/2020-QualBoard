/* eslint-disable */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { withReadme } from 'storybook-readme';
import moment from 'moment-timezone';
import random from 'lodash.random';
import PromptReadme from '../prompts.md';
import PromptHeader from 'shared/components/prompts/prompt-header.jsx';
import Prompt from 'shared/components/prompts/prompt.jsx';
import generateMediaItems from '../../../../test/utility/generate-media-items';

const PromptWrapper = ({
  numMediaItems,
  title,
  text,
}) => {
  const task = {
    title,
    text,
    type: 1,
    mediaItems: (numMediaItems > 0) ?
      generateMediaItems(numMediaItems) :
      null,
    responses: [],
  };

  return (
    <Prompt
      task={task}
      identityServerUri="https://alpha.2020identity.com"
      currentUserTimeZone="America/Chicago"
    />
  );
};

const NoticePrompts = storiesOf('Prompt Types/Notice', module);
NoticePrompts.addDecorator(withKnobs);

// Notices
NoticePrompts.add('Notice Prompt', withReadme([PromptReadme], () => (
  <PromptWrapper
    title={text('title', 'Thank You')}
    text={text('text', 'We are glad you participated in our survey.')}
  />
)));

NoticePrompts.add('Notice Prompt with Media', withReadme([PromptReadme], () => (
  <PromptWrapper
    numMediaItems={number('media count', 1)}
    title={text('title', 'Thank You')}
    text={text('text', 'We are glad you participated in our survey.')}
  />
)));

NoticePrompts.add('Notice Prompt with Media +5', withReadme([PromptReadme], () => (
  <PromptWrapper
    numMediaItems={number('media count', 6)}
    title={text('title', 'Thank You')}
    text={text('text', 'We are glad you participated in our survey.')}
  />
)));
