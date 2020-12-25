import { UserManager, Log as OidcLog } from 'oidc-client';
import { AppConfig } from 'app-config';
import { OidcWrapper } from 'shared/auth/oidc-wrapper';
import 'active-tab';

export class AuthManager {
  constructor() {
    // let nopLogger = {
    //   debug(a, b){
    //     console.log(a, b);
    //   },
    //   info(a, b){
    //     console.log(a, b);
    //   },
    //   warn(a, b){
    //     console.log(a, b);
    //   },
    //   error(a, b){
    //     console.log(a, b);
    //   }
    // };

    OidcLog.logger = console;
    OidcLog.level = OidcLog.ERROR;

    this.appConfig = new AppConfig();
    this.um = new UserManager({
      authority: this.appConfig.identity.identityServerUri,
      client_id: this.appConfig.identity.identityClientId,
      redirect_uri: this.appConfig.identity.redirectUri,
      silent_redirect_uri: this.appConfig.identity.silentRedirectUri,
      response_type: this.appConfig.identity.responseType,
      scope: this.appConfig.identity.scope,
      post_logout_redirect_uri: this.appConfig.identity.postLogoutRedirectUri,
      automaticSilentRenew: true,
      monitorSession: true,
    });
    this.oidcWrapper = new OidcWrapper(this.um, this.appConfig);
  }

  async handleAuthFlow() {
    // user is logged in
    if (await this.oidcWrapper.isUserLoggedIn()) {
      return;
    }

    // this is a redirect from our identity server
    if (location.hash.indexOf('id_token') !== -1) {
      const result = await this.oidcWrapper.loginRedirectCallback();

      if (result.state && result.state.trim() !== '') {
        location.hash = result.state;
      } else {
        location.hash = '';
      }
      return;
    }

    // user is not authenticated, redirect
    await this.oidcWrapper.loginRedirect({
      data: window.location.hash,
      redirect_uri: window.location.origin,
    });
  }
}
