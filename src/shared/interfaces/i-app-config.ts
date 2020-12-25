interface IAnalyticsConfig {
  baseUrl: string;
  enableLogging: boolean;
}

interface IApiConfig {
  baseUrl: string;
  url: string;
}

interface IFroalaConfig {
  key: string;
}

interface IMediaConfig {
  apiProgressInterval: number;
  attachSourceMaximumDelay: number;
  attachSourceRetryLimit: number;
  awsKey: string;
  awsUrl: string;
  baseUrl: string;
  bucket: string;
  clientProgressInterval: number;
  enableLogging: boolean;
  urlRoute: string;
}

interface IIdentityConfig {
  accessTokenExpiringNotificationTime: number;
  automaticSilentRenew: boolean;
  identityClientId: string;
  identityServerUri: string;
  postLogoutRedirectUri: string;
  redirectUri: string;
  responseType: string;
  scope: string;
  silentRedirectUri: string;
  baseUrl: string;
}

interface IMessagingConfig {
  applicationId: string;
  baseUrl: string;
}

export interface IAppConfig {
  analytics?: IAnalyticsConfig;
  api?: IApiConfig;
  froala?: IFroalaConfig;
  identity?: IIdentityConfig;
  logging?: number;
  media?: IMediaConfig;
  messaging?: IMessagingConfig;
  url?: string;
}
