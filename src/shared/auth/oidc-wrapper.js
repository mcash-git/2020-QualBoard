import { UserManager } from 'oidc-client';
import { AppConfig } from 'app-config';

export class OidcWrapper {
  static inject = [UserManager, AppConfig];

  constructor(oidcUserManager, appConfig) {
    this.oidcUserManager = oidcUserManager;

    this.sessionStorageKey = `oidc.user:${appConfig.identity.identityServerUri
    }:${appConfig.identity.identityClientId}`;

    // Set up signout handling
    this.oidcUserManager.events.addUserSignedOut(async () => {
      this.oidcUserManager.removeUser();
      await this.loginRedirect({
        data: window.location.hash,
        redirect_uri: window.location.origin,
      });
    });

    this.oidcUserManager.events.addUserLoaded((user) => {
      this.accessToken = user.access_token;
      this._accessTokenUpdatedHandlers.forEach((fn) => fn(this.accessToken));
    });
  }

  _accessTokenUpdatedHandlers = [];

  async isUserLoggedIn() {
    if (this.user) {
      return true;
    }

    const user = await this.oidcUserManager.getUser();
    if (user && (this.accessToken === null || this.accessToken === undefined)) {
      this.accessToken = user.access_token;
      this.user = user;
    }
    return user !== null && user !== undefined && user.expired !== true;
  }

  loginRedirect(state) {
    return this.oidcUserManager.signinRedirect(state).then(result => result);
  }

  loginRedirectCallback() {
    return this.oidcUserManager.signinRedirectCallback().then(resp => {
      this.accessToken = resp.access_token;
      return resp;
    });
  }

  loginSilentCallback() {
    return this.oidcUserManager.signinSilentCallback().then(resp => resp);
  }

  logoutRedirect() {
    return this.oidcUserManager.signoutRedirect();
  }

  async getUser() {
    if (!this.user) {
      this.user = await this.oidcUserManager.getUser();
    }
    return this.user;
  }

  async handleProfileUpdated(profile) {
    const fromSessionStorage =
      JSON.parse(window.sessionStorage[this.sessionStorageKey]);

    fromSessionStorage.profile.given_name = profile.firstName;
    fromSessionStorage.profile.family_name = profile.lastName;
    fromSessionStorage.profile.zoneinfo = profile.timeZone;

    // TODO: If the user changed their language, update that here too.

    // TODO: handle reloading of all avatars of the current user

    window.sessionStorage[this.sessionStorageKey] =
      JSON.stringify(fromSessionStorage);

    this.user = fromSessionStorage;
  }

  addAccessTokenUpdatedHandler(fn) {
    if (!fn || typeof fn !== 'function') {
      console.error('fn is not a function:', { fn });
      throw new Error('Unable to register.  You must supply a valid function');
    }
    this._accessTokenUpdatedHandlers.push(fn);
  }

  removeAccessTokenUpdatedHandler(fn) {
    this._accessTokenUpdatedHandlers = this._accessTokenUpdatedHandlers.filter((f) => f !== fn);
  }
}
