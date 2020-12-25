import { createSelector } from 'reselect';
import activityTasksSelector from './activity-tasks-selector';

const activityTasksSelectedTaskSelector = createSelector(
  (state) => state.individualActivity && state.individualActivity.id,
  (state) => state.activityTasks,
  activityTasksSelector,
  (iaId, allActivityTasks, tasks) => {
    const activityTasksState = allActivityTasks[iaId];

    // this will work even if there is no selected task, because in that case it returns undefined.
    return tasks && tasks.find((t) => t.id === activityTasksState.selectedTaskId);
  },
);

export default activityTasksSelectedTaskSelector;
