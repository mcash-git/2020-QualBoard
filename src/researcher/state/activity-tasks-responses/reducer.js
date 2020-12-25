import { handleActions } from 'redux-actions';
import setFetchStatus from '../misc/reducers/set-task-level-fetch-status';
import setTaskResponses from './reducers/set-task-responses';
import addTaskResponse from './reducers/add-task-response';

const activityTasksReducer = handleActions({
  ACTIVITY_TASKS_RESPONSES: {
    ADD_TASK_RESPONSE: (state, action) => addTaskResponse(state, action),
    SET_FETCH_STATUS: setFetchStatus,
    SET_TASK_RESPONSES: setTaskResponses,
  },
}, {});

export default activityTasksReducer;
