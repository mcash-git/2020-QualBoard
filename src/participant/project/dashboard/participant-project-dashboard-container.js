import { activationStrategy } from 'aurelia-router';
import { Api } from 'api/api';
import { fetchStatuses } from 'shared/enums/fetch-statuses';
import { participantStore } from 'participant/state/participant-store';
import { receiveProjectDashboardEvents } from 'participant/state/actions/all';
import { enums } from '2020-qb4';

const CompletionStatuses = enums.completionStatuses;

export class ParticipantProjectDashboardContainer {
  static inject = [Api];

  constructor(api) {
    this.api = api;
    this.entryCreatedSubscriptions = [];
    this.subscribeToEntryCreated = this.subscribeToEntryCreated.bind(this);
  }

  activate({ projectId, userId }, routeConfig) {
    this.projectId = projectId;
    this.userId = userId;

    // "ACTIVE" or "INACTIVE"
    this.eventFilter = routeConfig.settings.eventFilter;

    const handleStateChange = () => {
      const { project, projectDashboard } = participantStore.getState();

      this.instructions = project.instructions;
      this.state = projectDashboard;

      this.entryCreatedSubscriptions.forEach(sub => {
        const entry = this.state.events.find(e => e.id === sub.eventId);
        if (entry.activeRepetitionStatus.value === CompletionStatuses.started.value) {
          sub.action();
          sub.hasRun = true;
        }
      });

      this.entryCreatedSubscriptions = this.entryCreatedSubscriptions.filter(sub => !sub.hasRun);
    };

    this.unsubscribeFromStore = participantStore.subscribe(handleStateChange);
    this.fetchProjectDashboard();
  }

  unbind() {
    if (this.unsubscribeFromStore) {
      this.unsubscribeFromStore();
    }
  }

  determineActivationStrategy() {
    return activationStrategy.replace;
  }

  async fetchProjectDashboard() {
    this.status = fetchStatuses.pending;

    try {
      const events =
        await this.api.query.projectUsers.getParticipantEventDash(this.projectId, this.userId);

      participantStore.dispatch(receiveProjectDashboardEvents(this.projectId, events));
      this.status = fetchStatuses.success;
    } catch (error) {
      this.status = fetchStatuses.failure;
    }
  }

  subscribeToEntryCreated(eventId, action) {
    this.entryCreatedSubscriptions.push({ eventId, action });
  }
}
