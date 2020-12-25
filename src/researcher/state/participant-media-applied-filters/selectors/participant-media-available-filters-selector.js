import { createSelector } from 'reselect';

export default createSelector(
  (state) => state.project.id,
  (state) => state.participantMediaAppliedFilters,
  (projectId, allAppliedFiltersState) => {
    const appliedFiltersState = allAppliedFiltersState[projectId];
    return appliedFiltersState && appliedFiltersState.availableFilters;
  },
);
