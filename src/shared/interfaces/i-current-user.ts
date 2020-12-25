export interface ICurrentUser {
  accessToken?: string;
  authTime?: number;
  email: string | null;
  emailVerified?: boolean;
  expiresAt?: string;
  firstName?: string;
  globalAccessScope?: string;
  idToken?: string;
  idp?: string;
  isDeveloper?: boolean;
  isSuperUser?: boolean;
  lastName?: string;
  preferredUsername?: string;
  scope?: string;
  sessionState?: string;
  sid?: string;
  state: any;
  timeZone?: string;
  tokenType?: string;
  userId?: string;
}
