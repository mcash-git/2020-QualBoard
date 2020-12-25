/* eslint-disable */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, number, object } from '@storybook/addon-knobs';
import { withReadme }  from 'storybook-readme';

import Checkbox from 'shared/components/checkbox';
import CheckboxTree from 'shared/components/checkbox-tree/checkbox-tree';

import CheckboxReadme from './checkbox.md';
import CheckboxTreeReadme from './checkbox-tree.md';
import checkboxTreeModel from './checkbox-tree-model.json'

import ToggleSwitch from 'shared/components/toggle-switch';
import ToggleSwitchReadme from './toggle-switch.md';

const checkboxStories = storiesOf('Checkboxes', module);
checkboxStories.addDecorator(withKnobs);

checkboxStories.add('Simple checkbox', withReadme([CheckboxReadme], () => {
  return (
    <Checkbox
      changeHandler={action('change')}
      isChecked={boolean('isChecked', false)}
      isDisabled={boolean('isDisabled')}
      isIndeterminate={boolean('isIndeterminate')}
      checkboxId={text('checkboxId')}
      labelText={text('label text', 'This is the checkbox\'s label')}
    />
  );
}));

checkboxStories.add('Checkbox tree', withReadme([CheckboxTreeReadme], () => {
  return (
    <div className="card-block">
      <CheckboxTree
        text={text('Top level text', 'Top level text')}
        isExpanded={boolean('isExpanded')}
        childNodes={object('childNodes', checkboxTreeModel)}
        selectedValues={object('selected values', [])}
        addValues={action('addValues')}
        removeValues={action('removeValues')}
      />
    </div>
  );
}));

checkboxStories.add('Toggle Switch', withReadme([ToggleSwitchReadme], () => {
  return (
    <ToggleSwitch
      changeHandler={action('change')}
      isChecked={boolean('isChecked', false)}
      isDisabled={boolean('isDisabled')}
      isIndeterminate={boolean('isIndeterminate')}
      checkboxId={text('checkboxId')}
    />
  );
}));



export default checkboxStories;
