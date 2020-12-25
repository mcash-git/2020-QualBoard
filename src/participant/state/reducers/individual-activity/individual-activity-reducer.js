import { actionNames } from 'participant/state/actions/all';
import { setIndividualActivity } from './set-individual-activity';
import { addOrRemoveRequiredFollowup } from './add-or-remove-required-followup';

export function individualActivityReducer(state, action) {
  switch (action.type) {
    case actionNames.receiveIndividualActivity:
      return setIndividualActivity(state, action);
    case actionNames.receiveTaskResponse:
      return addOrRemoveRequiredFollowup(state, action);
    default:
      return state;
  }
}
