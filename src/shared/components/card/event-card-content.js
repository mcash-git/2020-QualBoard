import { bindable, bindingMode } from 'aurelia-framework';

export class EventCardContent {
  @bindable({ defaultBindingMode: bindingMode.oneWay })
  card;

  activate(model) {
    this.card = model.card;
  }
}
