import { createSelector } from 'reselect';
import activityTasksSelectedTaskSelector from '../../activity-tasks/selectors/activity-tasks-selected-task-selector';

const activityTasksResponsesFetchStatusSelector = createSelector(
  activityTasksSelectedTaskSelector,
  (state) => state.activityTasksResponses,
  (selectedTask, allActivityTasksResponsesState) => {
    if (!selectedTask) {
      return null;
    }

    const activityTasksResponsesState =
      allActivityTasksResponsesState && allActivityTasksResponsesState[selectedTask.id];

    return activityTasksResponsesState && activityTasksResponsesState.fetchStatus;
  },
);

export default activityTasksResponsesFetchStatusSelector;
