import { bindable } from 'aurelia-framework';

export class ListCard {
  static inject = [Element];
  
  constructor(element) {
    element.classList.add('list-card-container');
    this.element = element;
  }
  
  @bindable cardModel;
}
