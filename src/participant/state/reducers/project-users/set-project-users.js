import { ProjectUserModel } from 'shared/models/project-user-model';

export function setProjectUsers(state, action) {
  const { users: dtoUsers, projectId } = action.payload;

  const users = dtoUsers.map(dto => ProjectUserModel.fromDto(dto));

  return {
    ...state,
    projectUsers: {
      users,
      projectId,
      lookupById: new Map(users.map(u => [u.userId, u])),
    },
  };
}
