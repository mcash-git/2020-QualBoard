import { bindable, bindingMode, computedFrom } from 'aurelia-framework';
import { fetchStatuses } from 'shared/enums/fetch-statuses';
import { growlProvider } from 'shared/growl-provider';

export class ParticipantProjectDashboardEvents {
  @bindable({ defaultBindingMode: bindingMode.oneWay }) state;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) status;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) projectId;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) projectInstructions;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) eventFilter;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) userId;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) subscribeToEntryCreated;

  stateChanged(state = null) {
    if (state === null) {
      return;
    }

    const filterByOpenState = this.eventFilter === 'ACTIVE' ?
      e => e.isOpen || e.isUpcoming :
      e => e.isClosed;

    this.noEventsText = `You do not have any ${this.eventFilter.toLowerCase()} events.`;

    this.events = state.events && state.events.filter(filterByOpenState);
  }

  statusChanged(status = null) {
    if (status === fetchStatuses.failure) {
      growlProvider.error('Error Retrieving Events', 'There was an error retrieving your events.  ' +
        'Please refresh your page and try again.  If the problem persists, contact support.');
    }
  }

  @computedFrom('status', 'state', 'projectId')
  get noEvents() {
    return this.status === fetchStatuses.success &&
      this.state.projectId === this.projectId &&
      this.events.length === 0;
  }

  @computedFrom('projectInstructions')
  get shouldShowProjectInstructions() {
    return this.projectInstructions && this.projectInstructions.title;
  }
}
