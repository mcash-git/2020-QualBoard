import { createSelector } from 'reselect';
import { fetchStatuses } from 'shared/enums/fetch-statuses';

const activityTasksFetchStatusSelector = createSelector(
  (state) => state.individualActivity.id,
  (state) => state.activityTasks,
  (iaId, allActivityTasksState) => {
    const activityTasksState = allActivityTasksState[iaId];
    return (activityTasksState && activityTasksState.fetchStatus) || fetchStatuses.pending;
  },
);

export default activityTasksFetchStatusSelector;
