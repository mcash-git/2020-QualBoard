import { bindable, bindingMode } from 'aurelia-framework';
import { Router } from 'aurelia-router';

export class CardDropDown {
  @bindable({ defaultBindingMode: bindingMode.oneTime }) dropDownItems;

  static inject = [Router];

  constructor(router) {
    this.router = router;
  }

  openMenu(event) {
    const outsideClickHandler = () => {
      if (this && this.menu && this.menu.classList &&
        this.menu.classList.remove) {
        this.menu.classList.remove('open');
      }
      document.body.removeEventListener('click', outsideClickHandler);
    };
    this.menu.classList.toggle('open');
    document.body.addEventListener('click', outsideClickHandler);

    event.stopPropagation();
    return true;
  }

  navigate(href) {
    window.location.href = href;
  }
}
