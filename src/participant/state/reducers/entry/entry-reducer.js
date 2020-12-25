import { actionNames } from 'participant/state/actions/all';
import { setEntry } from './set-entry';
import { setNextTask } from './set-next-task';
import { insertOrReplaceTaskResponse } from './insert-or-replace-task-response';
import { updateEntryCompletionStatus } from './update-entry-completion-status';

export function entryReducer(state, action) {
  switch (action.type) {
    case actionNames.receiveEntry:
      return setEntry(state, action);
    case actionNames.receiveEntryStatusChange:
      return updateEntryCompletionStatus(state, action);
    case actionNames.receiveTaskResponse:
      return insertOrReplaceTaskResponse(state, action);
    case actionNames.receiveNextTask:
      return setNextTask(state, action);
    default:
      return state;
  }
}
