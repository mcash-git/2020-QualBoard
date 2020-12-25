import { ParticipantProjectDashboardEventModel } from 'participant/project/dashboard/participant-project-dashboard-event-model';
import { getProjectDashboardState } from 'participant/state/selectors/get-project-dashboard-state';
import { getCurrentUserState } from 'participant/state/selectors/get-current-user-state';
import { defaultCurrentUserState, defaultProjectDashboardState } from 'participant/state/default-state';

export function setEvents(state, action) {
  const { projectId, events } = action.payload;
  const projectDashboard = getProjectDashboardState(state) || defaultProjectDashboardState;
  const currentUser = getCurrentUserState(state) || defaultCurrentUserState;
  
  return {
    ...state,
    projectDashboard: {
      ...projectDashboard,
      events: events
        .map(e => ParticipantProjectDashboardEventModel.fromDto(e, currentUser.user.timeZone))
        .sort((e1, e2) => e1.compareTo(e2)),
      projectId,
    },
  };
}
