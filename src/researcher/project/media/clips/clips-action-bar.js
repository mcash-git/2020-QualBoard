import { computedFrom } from 'aurelia-framework';
import get from 'lodash.get';

export class ClipsActionBar {
  activate(model) {
    this.model = model;
    this.exportInsights = (insights) => this.model.exportInsights(insights);
  }
  
  @computedFrom('model.state.selectedInsights.length')
  get numSelectedInsights() {
    return this.model.state.selectedInsights.length;
  }
  
  @computedFrom('model.state.currentPage.items.length')
  get isSelectAllDisabled() {
    // undefined or 0 both should return trueisSelectAllDisabled
    return !get(this, 'model.state.currentPage.items.length');
  }
}
