import { enums } from '2020-qb4';
import { GroupTagModel } from 'researcher/models/group-tag-model';

const ProjectRoles = enums.projectRoles;

interface IProjectUserModel {
  projectId?:string;
  userId?:string;
  firstName?:string;
  lastName?:string;
  email?:string;
  displayName?:string;
  role?:any;
  groupTags?:GroupTagModel[];
}

export class ProjectUserModel implements IProjectUserModel {
  projectId?:string;
  userId?:string;
  firstName?:string;
  lastName?:string;
  email?:string;
  displayName?:string;
  role?:any;
  groupTags?:GroupTagModel[];

  constructor(model: IProjectUserModel) {
    this.projectId = model.projectId || null;
    this.userId = model.userId || null;
    this.firstName = model.firstName || null;
    this.lastName = model.lastName || null;
    this.email = model.email || null;
    this.displayName = model.displayName || null;
    this.role = model.role || ProjectRoles.participant;
    this.groupTags = model.groupTags || null;
  }

  static fromDto(dto:any, groupTagLookup:Map<string,GroupTagModel> = null): ProjectUserModel {
    const {
      projectId = null,
      userId = null,
      firstName = null,
      lastName = null,
      email = null,
      displayName = null,
      role = 3,
      groupTags: groupTagIds = null,
    } = dto;
    const groupTags = (groupTagLookup && groupTagIds) ?
      groupTagIds.map(id => groupTagLookup.get(id)).filter(t => t) :
      null;
    return new ProjectUserModel({
      projectId,
      userId,
      firstName,
      lastName,
      email,
      displayName,
      role: ProjectRoles.find((r) => r.int === role),
      groupTags,
    });
  }

  clone(overrides: IProjectUserModel) : ProjectUserModel {
    return new ProjectUserModel(Object.assign({}, this, overrides));
  }
}
