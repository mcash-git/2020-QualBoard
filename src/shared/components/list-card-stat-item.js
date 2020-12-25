import { computedFrom, bindable } from 'aurelia-framework';
import Drop from 'tether-drop';

export class ListCardStatItem {
  static inject = [Element];
  
  constructor(element) {
    this.element = element;
    element.classList.add('list-card-stat-item');
  }
  
  @bindable item;
  
  attached() {
    // TODO:  Check if the config can be changed after initialization and
    // actually change behavior.
    if (!this.hasExpandContent) {
      return;
    }
    
    this.dropConfig = {
      target: this.element,
      content: this.dropBodyElement,
      remove: false,
      openOn: 'click',
      position: 'bottom center',
      constrainToWindow: true,
      classes: 'drop-theme-filters list-card-expand-content',
    };
    
    this.drop = new Drop(this.dropConfig);
  }
  
  bind() {
    if (this.hasExpandContent) {
      this.element.classList.add('has-action');
    }
  }
  
  unbind() {
    if (this.drop !== undefined) {
      this.drop.destroy();
    }
  }
  
  @computedFrom('item.expandContent')
  get hasExpandContent() {
    return this.item.expandContent !== null && this.item.expandContent !== undefined;
  }
}
