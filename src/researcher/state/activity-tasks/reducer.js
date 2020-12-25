import { handleActions } from 'redux-actions';
import selectTask from './reducers/select-task';
import setFetchStatus from '../misc/reducers/set-activity-level-fetch-status';
import setTasks from './reducers/set-tasks';

const activityTasksReducer = handleActions({
  ACTIVITY_TASKS: {
    SELECT_TASK: selectTask,
    SET_FETCH_STATUS: setFetchStatus,
    SET_TASKS: setTasks,
  },
}, {});

export default activityTasksReducer;
