import hoverIntent from 'hoverintent';
import Drop from 'tether-drop';

export class UserTagInputItem {
  activate({
    item = null,
  } = {}) {
    this.user = item;
  }
  
  attached() {
    this.dropConfig = {
      target: this.liElement,
      content: this.dropBody,
      remove: false,
      openOn: null,
      position: 'bottom center',
      constrainToWindow: true,
      classes: 'drop-theme-filters',
    };
  
    this.drop = new Drop(this.dropConfig);
    hoverIntent(this.liElement, () => {
      this.drop.open();
    }, () => {
      this.drop.close();
    });
  }
  
  unbind() {
    this.drop.destroy();
  }
  
  remove() {
    this.liElement.dispatchEvent(new CustomEvent('remove-tag', {
      bubbles: true,
      detail: { item: this.user },
    }));
  }
}
