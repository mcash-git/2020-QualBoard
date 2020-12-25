import { bindable, bindingMode, computedFrom } from 'aurelia-framework';
import moment from 'moment';

export class FilterDates {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) startDate;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) endDate;
  
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  startDateValidationProperty;
  
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  endDateValidationProperty;
  
  @bindable({ defaultBindingMode: bindingMode.oneTime }) title;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) validator;
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  placeholderStart = 'After...';
  
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  placeholderEnd = 'Before...';
  
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  labelStart = 'Filter by date uploaded:';
  
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  labelEnd = 'and:';
  
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  expandedSessionStorageKey;
  
  @computedFrom('startDate', 'endDate')
  get filterCount() {
    let count = 0;
    if (moment(this.startDate).isValid()) {
      count++;
    }
    
    if (moment(this.endDate).isValid()) {
      count++;
    }
    
    return count;
  }
}
