import { bindable, bindingMode, computedFrom } from 'aurelia-framework';

export class ClipsActions {
  static inject = [
    Element,
  ];

  constructor(element) {
    this.element = element;
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) insights;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) exportInsights;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) deleteInsights;

  export() {
    if (!this.isSelecting) {
      return;
    }
    this.exportInsights(this.insights);
  }
  
  delete() {
    if (!this.isSelecting) {
      return;
    }
    this.deleteInsights(this.insights);
  }

  @computedFrom('insights.length')
  get isSelecting() {
    return this.insights && this.insights.length > 0;
  }
}
