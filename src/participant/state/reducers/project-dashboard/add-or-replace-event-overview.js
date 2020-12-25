import { getProjectDashboardState } from 'participant/state/selectors/get-project-dashboard-state';
import { getCurrentUserState } from 'participant/state/selectors/get-current-user-state';
import { ParticipantProjectDashboardEventModel } from 'participant/project/dashboard/participant-project-dashboard-event-model';
import { defaultCurrentUserState, defaultProjectDashboardState } from 'participant/state/default-state';

export function addOrReplaceEventOverview(state, action) {
  const { event } = action.payload;
  const projectDashboard = getProjectDashboardState(state) || defaultProjectDashboardState;
  const currentUser = getCurrentUserState(state) || defaultCurrentUserState;
  
  if (!projectDashboard.events ||
    projectDashboard.projectId !== event.projectId) {
    return state;
  }
  
  const events = [...projectDashboard.events];
  const eventModel =
    ParticipantProjectDashboardEventModel.fromDto(event, currentUser.user.timeZone);
  const eventIndex = events.findIndex(e => e.id === event.id);
  
  if (eventIndex === -1) {
    events.push(eventModel);
  } else {
    events[eventIndex] = eventModel;
  }
  
  return {
    ...state,
    projectDashboard: { ...projectDashboard, events },
  };
}
