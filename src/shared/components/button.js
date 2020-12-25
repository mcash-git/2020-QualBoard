import { bindable } from 'aurelia-framework';

export class Button {
  @bindable model;
  
  activate(model) {
    this.model = model;
  }
}
