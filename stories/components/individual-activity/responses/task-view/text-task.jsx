import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { withReadme } from 'storybook-readme';
import moment from 'moment-timezone';
import random from 'lodash.random';
import TaskReadme from './tasks.md';
import TaskHeader from 'shared/components/tasks/task-header.jsx';
import Task from 'shared/components/tasks/task.jsx';
import generateMediaItems from '../../../../../test/utility/generate-media-items';
import mockResponses from '../../../../dtos/responses.json';
import projectUsers from '../../../../dtos/project-users.json';

const TextTaskWrapper = ({
  numMediaItems,
  type,
  title,
  body,
  numResponses,
  doResponsesHaveMedia,
}) => {
  const task = {
    title,
    body,
    type,
    mediaItems: (numMediaItems > 0) ?
      generateMediaItems(numMediaItems) :
      null,
    responses: (numResponses > 0) ?
      mockResponses.map((r) => {
        const user = projectUsers[random(projectUsers.length - 1)];
        return {
          ...r,
          respondedOn: moment(r.responseTimeStamp),
          user,
          userId: user.userId,
        };
      }).slice(0, numResponses) : null,
  };

  return (
    <Task
      task={task}
      identityServerUri="https://alpha.2020identity.com"
      currentUserTimeZone="America/Chicago"
    />
  );
};

const responses = storiesOf('Individual Activity/Responses/Task View', module);
responses.addDecorator(withKnobs);

responses.add('Text Task with Responses', withReadme([TaskReadme], () => (
  <div style={{maxWidth: '1164px', marginLeft: 'auto', marginRight: 'auto', marginTop: '2rem' }}>
    <TextTaskWrapper
      type={number('enum type of probe', 0)}
      numMediaItems={number('number of task media items', 1)}
      title={text('task title', 'The Third Question')}
      body={text('task body', 'What is the airspeed velocity of an unladen swallow?')}
      numResponses={number('number of responses to the task', 2)}
      doResponsesHaveMedia={boolean('do responses have media?', true)}
    />
  </div>
)));
