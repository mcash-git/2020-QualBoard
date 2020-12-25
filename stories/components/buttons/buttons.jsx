/* eslint-disable */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { withReadme }  from 'storybook-readme';

import IconButtonReadme from './icon-button.md';
import IconButton from 'shared/components/buttons/icon-button';

import PopButtonMenuReadme from './pop-button-menu.md';
import PopButtonMenu from 'shared/components/buttons/pop-button-menu';

const buttonStories = storiesOf('Buttons', module);
buttonStories.addDecorator(withKnobs);

// button.add('with text', () =>
//   (<button onClick={action('clicked')}>Hello Button</button>));

// button.add('with some emoji', () => (<button onClick={action('clicked')}>😀 😎 👍 💯</button>));

buttonStories.add('Icon as Button', withReadme([IconButtonReadme], () => {
  return (<IconButton
    action={action('clicked')}
    btnClass={text('button-class', '')}
    icon={text('icon', 'icon-schedule')}
    prependText={text('prependText', '')}
    appendText={text('appendText', '')} />);
}));

buttonStories.add('Popper menu button', withReadme([PopButtonMenuReadme], () => {
  return (
    <PopButtonMenu
      containerClass={text('container class', 'card-block')}
      btnId={text('button html ID', 'btn-id')}
    >
      <IconButton
        btnClass="drop-link"
        action={action('item 1 clicked')}
        icon="icon-schedule"
        appendText="Item 1"
      />
      <IconButton
        btnClass="drop-link"
        action={action('item 2 clicked')}
        icon="icon-download"
        appendText="Item 2"
      />
      <span>here is a non-button item</span>
    </PopButtonMenu>
);
}));

export default buttonStories;
