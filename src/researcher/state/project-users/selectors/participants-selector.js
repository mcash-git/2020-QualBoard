import { createSelector } from 'reselect';
import { enums } from '2020-qb4';
import projectUsersSelector from './project-users-selector';

const ProjectRoles = enums.projectRoles;

const participantsSelector = createSelector(
  projectUsersSelector,
  (users) => users && users.filter((u) => u.role.value === ProjectRoles.participant.value),
);

export default participantsSelector;
