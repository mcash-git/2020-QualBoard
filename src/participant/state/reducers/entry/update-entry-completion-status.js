import { getEntryState } from 'participant/state/selectors/get-entry-state';
import { defaultEntryState } from 'participant/state/default-state';
import { enums } from '2020-qb4';

const CompletionStatuses = enums.completionStatuses;

export function updateEntryCompletionStatus(state, action) {
  const { entryDetails } = action.payload;
  const entryState = getEntryState(state) || defaultEntryState;
  
  if (entryState.entryId !== entryDetails.repetitionId) {
    return state;
  }
  
  return {
    ...state,
    entry: {
      ...state.entry,
      entry: entryState.entry.clone({
        completionStatus: CompletionStatuses[entryDetails.status],
      }),
    },
  };
}
