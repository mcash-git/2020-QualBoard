import { actionNames } from 'participant/state/actions/all';
import { setProject } from './set-project';

export function projectReducer(state, action) {
  switch (action.type) {
    case actionNames.receiveProject:
      return setProject(state, action);
    default:
      return state;
  }
}
