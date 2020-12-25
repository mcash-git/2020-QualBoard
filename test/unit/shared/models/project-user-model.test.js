import { enums } from '2020-qb4';
import { ProjectUserModel } from 'shared/models/project-user-model';
import users from 'dtos/project-users.json';

const ProjectRoles = enums.projectRoles;

describe('ProjectUserModel', () => {
  describe('(static) fromDto()', () => {
    let dto;
    let model;
    beforeEach(() => {
      dto = users[0];
      model = ProjectUserModel.fromDto(dto);
    });
    
    it('maps dto.role (int) to enum object reference', () => {
      expect(model.role).not.toBe(dto.role);
      expect(model.role.value).toBe(ProjectRoles.find(pr => pr.int === dto.role).value);
    });
  });
});
