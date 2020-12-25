import { createSelector } from 'reselect';
import { ProjectUserModel } from 'shared/models/project-user-model';
import groupTagLookupSelector from '../../group-tags/selectors/group-tag-lookup-selector';

export default createSelector(
  (state) => state.project.id,
  groupTagLookupSelector,
  (state) => state.projectUsers,
  (projectId, groupTagLookup, allProjectUsersState) => {
    const projectUsersState = allProjectUsersState[projectId];
    const users = projectUsersState && projectUsersState.users;
    return users && users.map(user => ProjectUserModel.fromDto(user, groupTagLookup));
  },
);
