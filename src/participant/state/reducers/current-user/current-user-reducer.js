import { actionNames } from 'participant/state/actions/all';

export function currentUserReducer(state, action) {
  if (action.type === actionNames.receiveCurrentUser) {
    const { user } = action.payload;

    return {
      ...state,
      currentUser: {
        user,
      },
    };
  }

  return state;
}
