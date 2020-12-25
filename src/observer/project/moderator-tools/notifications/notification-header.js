import { bindable, bindingMode } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ViewState } from 'shared/app-state/view-state';

export class NotificationHeader {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) appliedFilters;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) unreadCounts;

  static inject = [EventAggregator, ViewState];
  constructor(ea, viewState) {
    this.ea = ea;
    this.viewState = viewState;
  }

  hide() {
    this.viewState.moderatorToolsOpen = false;
  }

  doSearch(query) {
    this.appliedFilters.search = query;
    this.ea.publish('fetch-notifications');
  }
}
