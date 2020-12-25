import { bindable, bindingMode } from 'aurelia-framework';

export class NotificationCard {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) card;
}
