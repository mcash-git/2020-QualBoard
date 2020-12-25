import { createSelector } from 'reselect';

export default createSelector(
  (state) => state.project.id,
  (state) => state.participantMediaAppliedFilters,
  (projectId, allAppliedFiltersState) => {
    const appliedFiltersState = allAppliedFiltersState[projectId];
    const appliedFilters = appliedFiltersState && appliedFiltersState.appliedFilters;

    if (!appliedFilters) {
      return 0;
    }

    let count = 0;

    if (appliedFilters.createdAfter) {
      count++;
    }

    if (appliedFilters.createdBefore) {
      count++;
    }

    count += (appliedFilters.assetTypes || []).length;

    count += (appliedFilters.taskIds || []).length;

    count += ((appliedFilters.tagsRule && appliedFilters.tagsRule.tags) || []).length;

    count += ((appliedFilters.usersRule && appliedFilters.usersRule.users) || []).length;

    return count;
  },
);
