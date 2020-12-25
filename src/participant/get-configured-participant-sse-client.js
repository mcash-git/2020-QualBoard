import { participantStore } from 'participant/state/participant-store';
import { getSseState } from 'participant/state/selectors/get-sse-state';
import {
  updateEventOverview,
  updateEventOpenState,
  receiveNextTask,
  receiveTaskResponse,
} from 'participant/state/actions/all';
import { receiveEntryStatusChange } from './state/actions/all';

export async function getConfiguredParticipantSseClient(eventClient) {
  // the following events are sent directly to the user, no subscription is necessary

  eventClient.addEventListener('ParticipantEventOverview', msg => {
    participantStore.dispatch(updateEventOverview(msg));
  });

  eventClient.addEventListener('EventRepetitionStatusChanged', msg => {
    participantStore.dispatch(receiveEntryStatusChange(msg));
  });

  eventClient.addEventListener('TaskResponse', msg => {
    participantStore.dispatch(receiveTaskResponse(msg));
  });

  eventClient.addEventListener('NextTaskDetails', msg => {
    participantStore.dispatch(receiveNextTask(msg));
  });

  // 'NotificationFeed'

  // the following events are only sent to subscribed channels

  eventClient.addEventListener('EventOpened', msg => {
    participantStore.dispatch(updateEventOpenState(msg, true));
  });

  eventClient.addEventListener('EventClosed', msg => {
    participantStore.dispatch(updateEventOpenState(msg, false));
  });

  initializeSubscriptionHandling(eventClient);

  eventClient.onerror = e => console.error('event source error', e);

  return eventClient;
}

function getSubscribedChannels() {
  return getSseState(participantStore.getState()).subscribedChannels;
}

function initializeSubscriptionHandling(eventClient) {
  let subscribedChannels = [];

  participantStore.subscribe(() => {
    const updatedChannels = getSubscribedChannels();
    const removedChannels = subscribedChannels.filter(c => updatedChannels.indexOf(c) === -1);
    const addedChannels = updatedChannels.filter(c => subscribedChannels.indexOf(c) === -1);

    if (removedChannels.length > 0) {
      eventClient.unsubscribeFromChannels(removedChannels);
    }
    if (addedChannels.length > 0) {
      eventClient.subscribeToChannels(addedChannels);
    }

    subscribedChannels = updatedChannels;
  });
}
