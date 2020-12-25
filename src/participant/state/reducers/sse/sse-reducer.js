import { actionNames } from 'participant/state/actions/all';
import { addOrReplaceProjectSubscription } from './add-or-replace-project-subscription';

export const sseReducer = (state, action) => {
  switch (action.type) {
    case actionNames.receiveProjectDashboardEvents:
      return addOrReplaceProjectSubscription(state, action);
    default:
      return state;
  }
};
