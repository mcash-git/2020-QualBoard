import { bindable } from 'aurelia-framework';

export class ParticipantCardTile {
  static inject = [Element];

  constructor(element) {
    element.classList.add('card-tile-container');
    this.element = element;
  }

  @bindable cardModel;
}
