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
  mediaRequired,
  responseTextRequired,
  hasLogic,
}) => {
  const task = {
    title,
    text,
    type,
    mediaRequired,
    responseTextRequired,
    hasLogic,
    mediaItems: (numMediaItems > 0) ?
      generateMediaItems(numMediaItems) :
      null,
    responses: [],
    matrixColumns: [
      { id: 1, text: 'Unlikely' },
      { id: 2, text: 'Likely' }
    ],
    matrixRows: [
      { id:3, text: 'Coke' },
      { id:4, text: 'Pepsi' },
      { id:5, text: 'Sprite' },
      { id:6, text: 'Dr. Pepper' },
    ]
  };

  return (
    <Prompt
      task={task}
      identityServerUri="https://alpha.2020identity.com"
      currentUserTimeZone="America/Chicago"
    />
  );
};

const MatrixPrompts = storiesOf('Prompt Types/Matrix', module);
MatrixPrompts.addDecorator(withKnobs);

// Matrix Multiple Choice
MatrixPrompts.add('Multiple Choice Prompt', withReadme([PromptReadme], () => (
  <PromptWrapper
    title={text('title', 'Choose One')}
    text={text('text', 'Which are the soft drinks you are most likely to consider when going to the grocery?')}
    type={4}
    responseTextRequired={boolean('responseTextRequired', false)}
    mediaRequired={boolean('mediaRequired', false)}
    hasLogic={boolean('hasLogic', false)}
  />
)));

MatrixPrompts.add('Multiple Choice with Media', withReadme([PromptReadme], () => (
  <PromptWrapper
    title={text('title', 'Choose One')}
    text={text('text', 'Which are the soft drinks you are most likely to consider when going to the grocery?')}
    numMediaItems={number('media', 1)}
    type={4}
    responseTextRequired={boolean('responseTextRequired', false)}
    mediaRequired={boolean('mediaRequired', false)}
    hasLogic={boolean('hasLogic', false)}
  />
)));

MatrixPrompts.add('Multiple Choice with Media +5', withReadme([PromptReadme], () => (
  <PromptWrapper
    title={text('title', 'Choose One')}
    text={text('text', 'Which are the soft drinks you are most likely to consider when going to the grocery?')}
    numMediaItems={number('media', 6)}
    type={4}
    responseTextRequired={boolean('responseTextRequired', false)}
    mediaRequired={boolean('mediaRequired', false)}
    hasLogic={boolean('hasLogic', false)}
  />
)));

// Matrix Multiple Multiple Answer
MatrixPrompts.add('Multiple Answer Prompt', withReadme([PromptReadme], () => (
  <PromptWrapper
    title={text('title', 'Choose One')}
    text={text('text', 'Which are the soft drinks you are most likely to consider when going to the grocery?')}
    type={5}
    responseTextRequired={boolean('responseTextRequired', false)}
    mediaRequired={boolean('mediaRequired', false)}
    hasLogic={boolean('hasLogic', false)}
  />
)));

// Matrix Multiple Multiple Answer
MatrixPrompts.add('Multiple Answer with Media', withReadme([PromptReadme], () => (
  <PromptWrapper
    title={text('title', 'Choose One')}
    text={text('text', 'Which are the soft drinks you are most likely to consider when going to the grocery?')}
    numMediaItems={number('media', 1)}
    type={5}
    responseTextRequired={boolean('responseTextRequired', false)}
    mediaRequired={boolean('mediaRequired', false)}
    hasLogic={boolean('hasLogic', false)}
  />
)));

// Matrix Multiple Multiple Answer
MatrixPrompts.add('Multiple Answer with Media +5', withReadme([PromptReadme], () => (
  <PromptWrapper
    title={text('title', 'Choose One')}
    text={text('text', 'Which are the soft drinks you are most likely to consider when going to the grocery?')}
    numMediaItems={number('media', 6)}
    type={5}
    responseTextRequired={boolean('responseTextRequired', false)}
    mediaRequired={boolean('mediaRequired', false)}
    hasLogic={boolean('hasLogic', false)}
  />
)));
