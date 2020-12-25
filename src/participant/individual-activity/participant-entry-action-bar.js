import { computedFrom } from 'aurelia-framework';
import get from 'lodash.get';

export class ParticipantIndividualActivityActionBar {
  activate(model) {
    this.model = model;
  }
  
  @computedFrom('model.state.individualActivity.requiredFollowups.length')
  get hasUnansweredRequiredFollowups() {
    return get(this, 'model.state.individualActivity.requiredFollowups.length') > 0;
  }
  
  @computedFrom('model.state.entry.id', 'model.state.individualActivity.entries.length')
  get entry() {
    const id = get(this, 'model.state.entry.id');
    const entryOverviews = get(this, 'model.state.individualActivity.entries');
    
    if (id === undefined || entryOverviews === undefined) {
      return null;
    }
    
    return entryOverviews.find(e => e.id === id);
  }
  
  @computedFrom('model.state.individualActivity.entries.length')
  get entries() {
    return get(this, 'model.state.individualActivity.entries');
  }
}
