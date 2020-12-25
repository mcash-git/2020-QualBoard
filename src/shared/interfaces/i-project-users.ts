import { IProjectUser } from './i-project-user';

export interface IProjectUsers {
  projectId:string;
  users:IProjectUser[];
  lookupById:Map<string,IProjectUser>;
}
