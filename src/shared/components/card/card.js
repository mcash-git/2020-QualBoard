import { bindable, bindingMode } from 'aurelia-framework';
import { Router } from 'aurelia-router';

export class Card {
  @bindable({ defaultBindingMode: bindingMode.oneWay })
  card;

  static inject = [Router];

  constructor(router) {
    this.router = router;
  }

  activate(model) {
    this.card = model.card;
  }

  cardClick() {
    const navigationInstruction = this.router.currentInstruction.getAllInstructions();
    navigationInstruction[0].router.navigateToRoute(this.card.routeName, this.card.routeParams);
  }
}
