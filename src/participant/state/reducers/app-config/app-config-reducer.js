import { actionNames } from 'participant/state/actions/all';

export function appConfigReducer(state, action) {
  if (action.type === actionNames.receiveAppConfig) {
    return { ...state, appConfig: action.payload.appConfig };
  }
  
  return state;
}
