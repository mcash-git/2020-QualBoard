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
  type,
  autoWrapOptions,
  mediaRequired,
  responseTextRequired,
  hasLogic,
}) => {
  const task = {
    title,
    text,
    type,
    autoWrapOptions,
    mediaRequired,
    responseTextRequired,
    hasLogic,
    mediaItems: (numMediaItems > 0) ?
      generateMediaItems(numMediaItems) :
      null,
    responses: [],
    options: [
      {
        id: '1',
        text: 'apple',
      },
      {
        id: '2',
        text: 'orange',
      }
    ],
  };

  return (
    <Prompt
      task={task}
      identityServerUri="https://alpha.2020identity.com"
      currentUserTimeZone="America/Chicago"
    />
  );
};

const MCMAPrompts = storiesOf('Prompt Types/MCMA', module);
MCMAPrompts.addDecorator(withKnobs);

// MCMA Multiple Choice
MCMAPrompts.add('Multiple Choice Prompt', withReadme([PromptReadme], () => (
  <PromptWrapper
    title={text('title', 'Choose One')}
    text={text('text', 'Which are the fruits you are most likely to consider when going to the grocery?')}
    autoWrapOptions={boolean('wrap', false)}
    type={2}
    responseTextRequired={boolean('responseTextRequired', false)}
    mediaRequired={boolean('mediaRequired', false)}
    hasLogic={boolean('hasLogic', false)}
  />
)));

MCMAPrompts.add('Multiple Choice with Media', withReadme([PromptReadme], () => (
  <PromptWrapper
    title={text('title', 'Choose One')}
    text={text('text', 'Which are the fruits you are most likely to consider when going to the grocery?')}
    numMediaItems={number('media', 1)}
    autoWrapOptions={boolean('wrap', false)}
    type={2}
    responseTextRequired={boolean('responseTextRequired', false)}
    mediaRequired={boolean('mediaRequired', false)}
    hasLogic={boolean('hasLogic', false)}
  />
)));

MCMAPrompts.add('Multiple Choice with Media +5', withReadme([PromptReadme], () => (
  <PromptWrapper
    title={text('title', 'Choose One')}
    text={text('text', 'Which are the fruits you are most likely to consider when going to the grocery?')}
    numMediaItems={number('media', 6)}
    autoWrapOptions={boolean('wrap', false)}
    type={2}
    responseTextRequired={boolean('responseTextRequired', false)}
    mediaRequired={boolean('mediaRequired', false)}
    hasLogic={boolean('hasLogic', false)}
  />
)));

// MA Multiple Answer
MCMAPrompts.add('Multiple Answer Prompt', withReadme([PromptReadme], () => (
  <PromptWrapper
    title={text('title', 'Choose Many')}
    text={text('text', 'Which are the fruits you are most likely to consider when going to the grocery?')}
    autoWrapOptions={boolean('wrap', false)}
    type={3}
    responseTextRequired={boolean('responseTextRequired', false)}
    mediaRequired={boolean('mediaRequired', false)}
    hasLogic={boolean('hasLogic', false)}
  />
)));

MCMAPrompts.add('Multiple Answer with Media', withReadme([PromptReadme], () => (
  <PromptWrapper
    title={text('title', 'Choose Many')}
    text={text('text', 'Which are the fruits you are most likely to consider when going to the grocery?')}
    numMediaItems={number('media', 1)}
    autoWrapOptions={boolean('wrap', false)}
    type={3}
    responseTextRequired={boolean('responseTextRequired', false)}
    mediaRequired={boolean('mediaRequired', false)}
    hasLogic={boolean('hasLogic', false)}
  />
)));

MCMAPrompts.add('Multiple Answer with Media +5', withReadme([PromptReadme], () => (
  <PromptWrapper
    title={text('title', 'Choose Many')}
    text={text('text', 'Which are the fruits you are most likely to consider when going to the grocery?')}
    numMediaItems={number('media', 6)}
    autoWrapOptions={boolean('wrap', false)}
    type={3}
    responseTextRequired={boolean('responseTextRequired', false)}
    mediaRequired={boolean('mediaRequired', false)}
    hasLogic={boolean('hasLogic', false)}
  />
)));
