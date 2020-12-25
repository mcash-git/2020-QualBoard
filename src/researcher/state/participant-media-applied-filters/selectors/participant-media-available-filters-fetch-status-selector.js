import { createSelector } from 'reselect';
import { fetchStatuses } from 'shared/enums/fetch-statuses';

export default createSelector(
  (state) => state.project.id,
  (state) => state.participantMediaAppliedFilters,
  (projectId, allParticipantMediaFiltersState) => {
    const participantMediaFiltersState = allParticipantMediaFiltersState[projectId];
    return (participantMediaFiltersState &&
      participantMediaFiltersState.fetchStatus) || fetchStatuses.pending;
  },
);
