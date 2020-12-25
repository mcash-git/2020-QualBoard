import { bindable, bindingMode } from 'aurelia-framework';

export class ProjectCardContent {
  @bindable({ defaultBindingMode: bindingMode.oneWay })
  card;

  activate(model) {
    this.card = model.card;
  }
}
