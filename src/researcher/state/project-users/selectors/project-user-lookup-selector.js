import { createSelector } from 'reselect';
import projectUsersSelector from './project-users-selector';

const projectUserLookupSelector = createSelector(
  projectUsersSelector,
  (projectUsers) => projectUsers && new Map(projectUsers.map(pu => [pu.userId, pu])),
);

export default projectUserLookupSelector;
