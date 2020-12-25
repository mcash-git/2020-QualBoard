import { getSseState } from 'participant/state/selectors/get-sse-state';
import { defaultSseState } from 'participant/state/default-state';

export function addOrReplaceProjectSubscription(state, action) {
  const { projectId } = action.payload;
  const sse = getSseState(state) || defaultSseState;
  const stateSubs = sse.subscribedChannels;
  const index = stateSubs.findIndex(s => /^participant-project-/.test(s));
  const subs = [...stateSubs];
  const sub = `participant-project-${projectId}`;
  
  if (index !== -1) {
    subs[index] = sub;
  } else {
    subs.push(sub);
  }
  
  return {
    ...state,
    sse: {
      ...sse,
      subscribedChannels: subs,
    },
  };
}
