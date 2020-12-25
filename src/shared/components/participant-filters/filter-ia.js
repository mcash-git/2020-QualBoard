import { computedFrom, bindable, bindingMode } from 'aurelia-framework';

export class FilterIa {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) events;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) individualActivities;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) title;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) type;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) isRequired;

  @bindable({ defaultBindingMode: bindingMode.oneTime })
  expandedSessionStorageKey;

  attached() {
    this.title = this.title || 'Individual Activities';
  }

  eventsMatcher(a, b) {
    return a.eventId === b.eventId;
  }

  @computedFrom('events.length')
  get badge() {
    if (this.events) {
      return this.events.length;
    }
    return 0;
  }
}
