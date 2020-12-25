import { createSelector } from 'reselect';
import currentUserSelector from 'shared/state/current-user/selectors/current-user-selector';
import projectUserLookupSelector from './project-user-lookup-selector';

const currentProjectUserSelector = createSelector(
  projectUserLookupSelector,
  currentUserSelector,
  (projectUserLookup, currentUser) => projectUserLookup &&
    projectUserLookup.get(currentUser.userId),
);

export default currentProjectUserSelector;
