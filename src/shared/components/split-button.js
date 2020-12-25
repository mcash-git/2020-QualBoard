import { bindable } from 'aurelia-framework';

export class SplitButton {
  @bindable model;
  
  activate(model) {
    this.model = model;
  }
}
