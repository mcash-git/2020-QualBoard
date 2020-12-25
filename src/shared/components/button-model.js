import { buttonTypes } from 'shared/enums/button-types';

export { buttonTypes };

export class ButtonModel {
  constructor({
    buttonClasses = 'btn-primary',
    clickHandler = null,
    href = null,
    iconClass = null,
    text = null,
    type = buttonTypes.normal,
  } = {}) {
    this.buttonClasses = buttonClasses;
    this.clickHandler = clickHandler;
    this.href = href;
    this.iconClass = iconClass;
    this.text = text;
    this.type = type;
  }
  
  viewModel = 'shared/components/button';
}
