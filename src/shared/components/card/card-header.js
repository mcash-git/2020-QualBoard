import { bindable, bindingMode } from 'aurelia-framework';
import { Api } from 'api/api';

export class CardHeader {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) card;

  static inject = [Api]
  constructor(api) {
    this.api = api;
  }
}
