import { bindable, bindingMode } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

export class NotificationDropFilters {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) appliedFilters;
  static inject = [EventAggregator];

  constructor(ea) {
    this.ea = ea;
  }

  attached() {
    this.appliedFilters.checked = [];
    this.appliedFilters.orderByNewest = true;
    this.appliedFilters.hideRead = false;
    this.setFilters();
  }

  setFilters() {
    this.filters = {
      checkboxes: [
        // { value: 1, name: 'New Messages' },
        { value: 'followup-response', name: 'Followups' },
        // { value: 3, name: 'Backroom Notes' },
        { value: 'event-open', name: 'Event Open' },
        { value: 'event-close', name: 'Event Closed' },
      ],
      hideRead: true,
    };
  }

  get badgeCount() {
    let count = 0;
    if (this.appliedFilters.checked && this.appliedFilters.checked.length > 0) {
      count += this.appliedFilters.checked.length;
    }

    if (this.appliedFilters.hideRead) {
      count += 1;
    }

    return count;
  }

  filterApplied() {
    this.ea.publish('fetch-notifications');
  }

  clearFilters() {
    this.appliedFilters.checked = [];
    this.appliedFilters.orderByNewest = true;
    this.appliedFilters.hideRead = false;
  }
}
