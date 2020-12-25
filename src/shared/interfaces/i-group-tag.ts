import { IProjectUser } from './i-project-user';

export interface IGroupTag {
  id?: string;
  color?: string;
  name: string;
  tagLower?: string;
  projectId: string;
  participants: IProjectUser[];
}
