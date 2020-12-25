import { createSelector } from 'reselect';
import { fetchStatuses } from 'shared/enums/fetch-statuses';

export default createSelector(
  (state) => state.project.id,
  (state) => state.groupTags,
  (projectId, allGroupTagsState) => {
    const groupTagsState = allGroupTagsState[projectId];
    return (groupTagsState && groupTagsState.fetchStatus) || fetchStatuses.pending;
  },
);
