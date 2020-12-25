/* global METADATA */

const origin = `${location.origin}/`; // eslint-disable-line
const identityScope = 'openid profile email phone address qualboard4_identity global qualboard4_api messaging_api media_api analytics_api';

export class AppConfig {
  constructor() {
    if (METADATA.ENV === 'development') {
      this.url = origin;
      this.logging = 4;

      this.api = {
        url: 'https://api-dev.qualboard.com/api',
        baseUrl: 'https://api-dev.qualboard.com',
      };

      this.identity = {
        identityServerUri: 'https://alpha.2020identity.com',
        identityClientId: '1473447706.apps.2020identity.com',
        redirectUri: `${origin}#/oidc/#`,
        responseType: 'id_token token',
        scope: identityScope,
        postLogoutRedirectUri: origin,
        silentRedirectUri: `${origin}silent-renew.html`,
      };

      this.messaging = {
        baseUrl: 'https://messaging-dev.2020ip.io',
        applicationId: 'f10c5b04-6292-4987-8fa0-310fa439a9e5',
      };

      this.media = {
        baseUrl: 'https://media-dev.2020ip.io',
        imageUriBase: 'https://media-dev.2020ip.io',
        urlRoute: '/api/amazon/sign',
        awsKey: 'AKIAJWEIL4JDHIQDMWSQ',
        bucket: 'twentytwenty.us-east-1.alpha',
        awsUrl: 'https://s3.amazonaws.com',
        enableLogging: false,
      };

      this.analytics = {
        baseUrl: 'https://analytics-dev.2020ip.io',
        enableLogging: false,
      };
    } else {
      this.url = window.SITE_URL;
      this.logging = 4;

      this.api = {
        url: window.API_URL,
        baseUrl: window.API_BASE_URL,
      };

      this.identity = {
        identityServerUri: window.IDENTITY_URL,
        identityClientId: window.IDENTITY_CLIENTID,
        redirectUri: window.REDIRECT_URI,
        responseType: 'id_token token',
        scope: identityScope,
        postLogoutRedirectUri: window.POSTLOGOUT_REDIRECT_URI,
        silentRedirectUri: window.SILENT_REDIRECT_URI,
        automaticSilentRenew: true,
        accessTokenExpiringNotificationTime: 60,
      };

      this.messaging = {
        baseUrl: window.MESSAGING_URL,
        applicationId: window.MESSAGING_APPLICATION_ID,
      };

      this.media = {
        baseUrl: window.MEDIA_URL,
        imageUriBase: window.MEDIA_IMAGE_URI_BASE,
        urlRoute: window.MEDIA_URL_ROUTE,
        awsKey: window.MEDIA_AWS_KEY,
        bucket: window.MEDIA_BUCKET,
        awsUrl: window.MEDIA_AWS_URL,
        enableLogging: false,
      };

      this.analytics = {
        baseUrl: window.ANALYTICS_URL,
        enableLogging: false,
      };
    }

    if (!this.api.url.endsWith('/')) {
      this.api.url += '/';
    }

    this.annotations = {
      baseUrl: `${this.api.url}annotations`,
    };

    this.identity.baseUrl = `${this.identity.identityServerUri}/api`;

    this.media.clientProgressInterval = 333;
    this.media.apiProgressInterval = 1000;
    this.media.attachSourceRetryLimit = 10;
    this.media.attachSourceMaximumDelay = 1200;

    this.froala = {
      key: '1ZSZGUSXYSMZb1JGZ==',
    };
  }
}
