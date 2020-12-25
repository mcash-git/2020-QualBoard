/* eslint-disable */
import React from 'react';
import Select from 'react-select';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, number, object } from '@storybook/addon-knobs';
import { withReadme }  from 'storybook-readme';
import 'react-select/dist/react-select.css';

import TagInputReadme from './tag-input.md';
import WrappedTagInput from './wrapped-tag-input';

import UsersSelectReadme from './users-select.md';
import WrappedUsersSelect from './wrapped-users-select';

import groupTags from '../../dtos/group-tags.json';
import projectUsers from '../../dtos/project-users.json';

const selectsStories = storiesOf('Selects', module);
selectsStories.addDecorator(withKnobs);

selectsStories.add('Tag Input', withReadme([TagInputReadme], () => {
  return (
    <div className="card-block">
      <WrappedTagInput
        projectId={text('projectId', 'project')}
        canAddTags={boolean('canAddTags', false)}
        canModify={boolean('canModify', true)}
        availableTags={object('availableTags', groupTags)}
        appliedTags={object('appliedTags', groupTags.slice(2, 9))}
      />
    </div>
  );
}));

selectsStories.add('Users Select', withReadme([UsersSelectReadme], () => {
  return (
    <div className="card-block">
      <WrappedUsersSelect
        projectId={text('projectId', 'project')}
        canModify={boolean('canModify', true)}
        availableUsers={object('availableUsers', projectUsers)}
        selectedUsers={object('selectedUsers', projectUsers.slice(2, 3))}
      />
    </div>
  );
}));
