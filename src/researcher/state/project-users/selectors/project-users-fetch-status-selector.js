import { createSelector } from 'reselect';
import { fetchStatuses } from 'shared/enums/fetch-statuses';

export default createSelector(
  (state) => state.project.id,
  (state) => state.projectUsers,
  (projectId, allProjectUsersState) => {
    const projectUsersState = allProjectUsersState[projectId];
    return (projectUsersState && projectUsersState.fetchStatus) || fetchStatuses.pending;
  },
);
