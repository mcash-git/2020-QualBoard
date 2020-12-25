import { getProjectDashboardState } from 'participant/state/selectors/get-project-dashboard-state';
import { defaultProjectDashboardState } from 'participant/state/default-state';

export function updateEventOpenState(state, action) {
  const { event, isOpen } = action.payload;
  const projectDashboard = getProjectDashboardState(state) || defaultProjectDashboardState;
  
  if (!projectDashboard.events || projectDashboard.projectId !== event.projectId) {
    return state;
  }
  const eventIndex = projectDashboard.events.findIndex(e => e.eventId === event.id);
  
  if (eventIndex === -1) {
    // how do we handle errors?  Should we kick off the retrieveEvents() action?
    console.error('Event not found - cannot update state');
    return state;
  }
  
  const events = [...projectDashboard.events];
  const eventModel = events[eventIndex].clone();
  eventModel.isOpen = isOpen;
  eventModel.isClosed = !isOpen;
  eventModel.isUpcoming = false;
  events[eventIndex] = eventModel;
  
  return {
    ...state,
    projectDashboard: {
      ...projectDashboard,
      events,
    },
  };
}
