import { receiveProjectUsers } from 'participant/state/actions/all';
import { setProjectUsers } from 'participant/state/reducers/project-users/set-project-users';
import { ProjectUserModel } from 'shared/models/project-user-model';
import users from 'dtos/project-users.json';

const projectId = 'some-project-id';

describe('project-users/setProjectUsers()', () => {
  let state;
  let action;
  let resultState;
  let projectUsers;
  
  beforeEach(() => {
    state = {
      projectUsers: {
        projectId: null,
        users: [],
        lookupById: new Map(),
      },
    };
    action = receiveProjectUsers(projectId, users);
    resultState = setProjectUsers(state, action);
    projectUsers = resultState.projectUsers;
  });
  
  it('sets lookupById (Map)', () => {
    const { lookupById } = projectUsers;
    expect(lookupById).toBeDefined();
    expect(lookupById).toBeInstanceOf(Map);
    
    users.forEach(u => {
      const user = lookupById.get(u.userId);
  
      expect(user).toBeDefined();
      expect(user.constructor.name).toBe(ProjectUserModel.name);
      expect(user.userId).toBe(u.userId);
    });
  });
  
  it('sets users (array), mapping from DTO to ProjectUserModels', () => {
    expect(projectUsers.users).toBeDefined();
    expect(projectUsers.users).toHaveLength(users.length);
    expect(projectUsers.users.every(u => u.constructor.name === ProjectUserModel.name));
  });
  
  it('sets the projectId', () => {
    expect(projectUsers.projectId).toBe(projectId);
  });
});
