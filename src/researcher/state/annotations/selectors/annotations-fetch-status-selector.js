import { createSelector } from 'reselect';
import { fetchStatuses } from 'shared/enums/fetch-statuses';

export default createSelector(
  (state) => state.project.id,
  (state) => state.annotations,
  (projectId, allAnnotationsState) => {
    const annotationsState = allAnnotationsState[projectId];
    return (annotationsState && annotationsState.fetchStatus) || fetchStatuses.pending;
  },
);
