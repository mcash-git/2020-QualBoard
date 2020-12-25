import { ProjectUserModel } from 'shared/models/project-user-model';

interface IGroupTag {
  id?: string;
  color?: string;
  name: string;
  tagLower?: string;
  projectId: string;
  participants: ProjectUserModel[];
}

export class GroupTagModel implements IGroupTag {
  public id:string;
  public color:string|null;
  public name:string;
  public tagLower:string|null;
  public projectId:string;
  public participants:ProjectUserModel[];

  constructor(model:IGroupTag) {
    this.id = model.id;
    this.color = model.color || null;
    this.name = model.name;
    this.tagLower = model.name.toLowerCase();
    this.projectId = model.projectId;
    this.participants = model.participants;
  }

  static fromDto(tag:any, projectUsers:any = []):GroupTagModel {
    if (!tag.projectId || !tag.name || !tag.id) {
      throw 'DTO must contain a dto.id, dto.name, and dto.projectId';
    }

    const filteredUsers = projectUsers.filter(p => p.groupTags && p.groupTags.indexOf(tag.id) !== -1);
    const users = filteredUsers.map(user => ProjectUserModel.fromDto(user));

    const {
      id,
      name,
      color,
      projectId,
      participants = users,
    } = tag;

    return new GroupTagModel({
      id,
      name,
      color,
      projectId,
      participants
    });
  }
}
