import { getAppConfigState } from 'participant/state/selectors/get-app-config-state';
import { getCurrentUserState } from 'participant/state/selectors/get-current-user-state';
import { getProjectUsersState } from 'participant/state/selectors/get-project-users-state';
import { getEntryState } from 'participant/state/selectors/get-entry-state';
import { ParticipantTaskModel } from 'participant/models/participant-task-model';
import {
  defaultEntryState,
  defaultAppConfigState,
  defaultCurrentUserState,
  defaultProjectUsersState,
} from 'participant/state/default-state';

export function setNextTask(state, action) {
  const { nextTaskDetails } = action.payload;
  const entryState = getEntryState(state) || defaultEntryState;
  const entryId = nextTaskDetails.entryId || nextTaskDetails.repetitionId;

  if (entryId !== entryState.entryId ||
    (entryState.nextTask && entryState.nextTask.id === nextTaskDetails.id)) {
    return state;
  }
  const entry = entryState.entry.clone();
  const appConfig = getAppConfigState(state) || defaultAppConfigState;

  const currentUser = getCurrentUserState(state) || defaultCurrentUserState;
  const projectUsersState = getProjectUsersState(state) || defaultProjectUsersState;
  const nextTask = ParticipantTaskModel
    .fromDto(
      nextTaskDetails.nextTask,
      appConfig.media.baseUrl,
      appConfig.media.imageUriBase,
      currentUser.user.timeZone,
      projectUsersState.lookupById,
      false,
    );

  // if the previous "nextTask" is not yet in "completedTasks" - put it there.
  if (entry.nextTask && entry.completedTasks.every(t => t.id !== entry.nextTask.id)) {
    entry.completedTasks.push(entry.nextTask);
  }

  entry.isLastTask = nextTaskDetails.isLastTask;
  entry.nextTask = nextTask;

  return {
    ...state,
    entry: {
      entryId,
      entry,
    },
  };
}
