import { buttonTypes } from 'shared/enums/button-types';

export { buttonTypes };

export class SplitButtonModel {
  constructor({
    text = null,
    dropDownItems = [],
    buttonClasses = 'btn-primary',
    type = buttonTypes.normal,
    href = null,
    clickHandler = null,
  } = {}) {
    this.text = text;
    this.dropDownItems = dropDownItems;
    this.buttonClasses = buttonClasses;
    this.type = type;
    this.href = href;
    this.clickHandler = clickHandler;
  }
  
  viewModel = 'shared/components/split-button';
}
