import { actionNames } from 'participant/state/actions/all';
import { setProjectUsers } from './set-project-users';

export function projectUsersReducer(state, action) {
  switch (action.type) {
    case actionNames.receiveProjectUsers:
      return setProjectUsers(state, action);
    default:
      return state;
  }
}
