import { getEntryState } from 'participant/state/selectors/get-entry-state';
import { ParticipantTaskResponseModel } from 'participant/models/participant-task-response-model';
import { getAppConfigState } from 'participant/state/selectors/get-app-config-state';
import { getCurrentUserState } from 'participant/state/selectors/get-current-user-state';
import { getProjectUsersState } from 'participant/state/selectors/get-project-users-state';
import {
  defaultEntryState,
  defaultAppConfigState,
  defaultCurrentUserState,
  defaultProjectUsersState,
} from 'participant/state/default-state';

export function insertOrReplaceTaskResponse(state, action) {
  const { response } = action.payload;
  // console.warn('insertOrReplaceTaskResponse', { state, response });
  const entryState = getEntryState(state) || defaultEntryState;
  response.taskId = response.taskId || response.taskPromptId;

  // server has not yet done: repetitionId => entryId - but will, and this will not break.
  if ((response.entryId || response.repetitionId) !== entryState.entryId) {
    return state;
  }

  const { entry } = entryState;
  const outEntry = entry.clone();
  let outTask;
  // response is TaskResponse - look first at entry.nextTask
  if (!response.parentResponseId) {
    if (entry.nextTask !== null && entry.nextTask.id === response.taskId) {
      // add clone of nextTask to completedTasks with the response
      // nextTask = null
      outTask = entry.nextTask.clone();

      outEntry.completedTasks = [...entry.completedTasks, outTask];
      outEntry.nextTask = null;
    } else {
      // look in completedTasks.
      const index = entry.completedTasks.findIndex(t => t.id === response.taskId);
      if (index === -1) {
        console.error('Unable to update state.  Task not found.', { state, action });
        return state;
      }
      outTask = entry.completedTasks[index].clone();
      outEntry.completedTasks[index] = outTask;
    }
  } else {
    // response is a comment, find task, then find parent response
    // if the response is a comment, the task must be completed.
    const index = entry.completedTasks.findIndex(t => t.id === response.taskId);
    if (index === -1) {
      return state;
    }
    outTask = entry.completedTasks[index].clone();
    outEntry.completedTasks[index] = outTask;
  }

  outTask.receiveResponse(toModel(response, outTask, state));

  return {
    ...state,
    entry: {
      ...entryState,
      entry: outEntry,
    },
  };
}

function toModel(response, task, state) {
  if (response.constructor.name === ParticipantTaskResponseModel.name) {
    return response.clone();
  }

  const appConfig = getAppConfigState(state) || defaultAppConfigState;
  const currentUser = getCurrentUserState(state) || defaultCurrentUserState;
  const projectUsersState = getProjectUsersState(state) || defaultProjectUsersState;
  return ParticipantTaskResponseModel.fromDto(
    response,
    task,
    appConfig.media.baseUrl,
    appConfig.media.imageUriBase,
    currentUser.user.timeZone,
    projectUsersState.lookupById,
    task.allResponses.find(r => r.id === response.parentResponseId),
  );
}
