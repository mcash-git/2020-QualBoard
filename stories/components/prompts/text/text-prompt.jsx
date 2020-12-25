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
  title,
  text,
  mediaRequired,
  responseTextRequired,
  hasLogic,
  numMediaItems,
}) => {
  const task = {
    title,
    text,
    type: 0,
    mediaRequired,
    responseTextRequired,
    hasLogic,
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

const TextPrompts = storiesOf('Prompt Types/Text', module);
TextPrompts.addDecorator(withKnobs);

// TEXT
TextPrompts.add('Text Prompt', withReadme([PromptReadme], () => (
  <PromptWrapper
    title={text('title', 'Soda Question')}
    responseTextRequired={boolean('responseTextRequired', false)}
    mediaRequired={boolean('mediaRequired', false)}
    hasLogic={boolean('hasLogic', false)}
    text={text('text', 'How many sodas do you consume in a day?')}
  />
)));

TextPrompts.add('Text Prompt with Media', withReadme([PromptReadme], () => (
  <PromptWrapper
    numMediaItems={number('media count', 1)}
    title={text('title', 'Soda Question')}
    responseTextRequired={boolean('responseTextRequired', false)}
    mediaRequired={boolean('mediaRequired', false)}
    hasLogic={boolean('hasLogic', false)}
    text={text('text', 'How many sodas do you consume in a day?')}
  />
)));

TextPrompts.add('Text Prompt with Media +5', withReadme([PromptReadme], () => (
  <PromptWrapper
    numMediaItems={number('media count', 6)}
    title={text('title', 'Soda Question')}
    text={text('text', 'How many sodas do you consume in a day?')}
    responseTextRequired={boolean('responseTextRequired', false)}
    mediaRequired={boolean('mediaRequired', false)}
    hasLogic={boolean('hasLogic', false)}
  />
)));
