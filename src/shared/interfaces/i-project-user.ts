import { IGroupTag } from './i-group-tag';

export interface IProjectUser {
  country: string;
  defaultLanguage?: string;
  displayName: string | null;
  email: string | null;
  emailConfirmed: boolean;
  firstName: string | null;
  groupTagObjects?: any;
  groupTags: IGroupTag[];
  isActive: boolean;
  lastName: string | null;
  phone: string | null;
  phoneConfirmed: boolean;
  projectId: string;
  role: number;
  timeZone: string;
  userId: string;
}
