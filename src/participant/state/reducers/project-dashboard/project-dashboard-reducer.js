import { actionNames } from 'participant/state/actions/all';
import { setEvents } from './set-events';
import { addOrReplaceEventOverview } from './add-or-replace-event-overview';
import { updateEventOpenState } from './update-event-open-state';

export const projectDashboardReducer = (state, action) => {
  switch (action.type) {
    case actionNames.receiveProjectDashboardEvents:
      return setEvents(state, action);
    case actionNames.updateEventOverview:
      return addOrReplaceEventOverview(state, action);
    case actionNames.updateEventOpenState:
      return updateEventOpenState(state, action);
    default:
      return state;
  }
};
