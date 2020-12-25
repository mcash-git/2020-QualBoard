import { bindable } from 'aurelia-framework';

// TODO:  Refactor - this isn't as reusable as I wanted it to be when I created it.  Should be
// named ProjectCardTile, and the @bindable should be a projectModel
export class CardTile {
  static inject = [Element];
  
  constructor(element) {
    element.classList.add('card-tile-container');
    this.element = element;
  }
  
  @bindable cardModel;
}
