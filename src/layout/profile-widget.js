import * as moment from 'moment-timezone';
import { noView } from 'aurelia-framework';
import { growlProvider } from 'shared/growl-provider';
import { EventAggregator } from 'aurelia-event-aggregator';
import { CurrentUser } from 'shared/current-user';
import { OidcWrapper } from 'shared/auth/oidc-wrapper';
import { DomainState } from 'shared/app-state/domain-state';
import { AppConfig } from 'app-config';
import { AvatarChangedEvent } from 'shared/events/avatar-changed-event';
import { ProfileContext } from '2020-identity';
import { setOlarkUserInfo } from 'shared/utility/set-olark-user-info';

@noView
export class ProfileWidget {
  static inject = [
    Element,
    CurrentUser,
    DomainState,
    OidcWrapper,
    EventAggregator,
    AppConfig,
  ];

  constructor(element, user, domainState, auth, ea, appConfig) {
    this.element = element;
    this.user = user;
    this.domainState = domainState;
    this.auth = auth;
    this.ea = ea;
    this.identityUrl = appConfig.identity.identityServerUri;

    this.element.id = 'tt_qb_profile-widget';

    this.profileContext = new ProfileContext({
      identityUrl: appConfig.identity.identityServerUri,
      tokenCallback: () => this.auth.accessToken,
      onProfileSave: this.handleProfileSaved.bind(this),
      onProfileSaveError: () => {
        growlProvider.removeValidationGrowls();
        growlProvider.error('Error', 'Your profile could not be updated.', { class: 'validation-error' });
      },
      onPasswordSave: this.handlePasswordSaved.bind(this),
      onPasswordSaveError: () => {
        growlProvider.removeValidationGrowls();
        growlProvider.error('Error', 'Your password could not be updated.', { class: 'validation-error' });
      },
    });
  }

  bind() {
    this.profileContext.initialize(this.element);
  }

  unbind() {
    this.profileContext.tearDown();
  }

  handleProfileSaved(modelData, avatarUpdated) {
    this._updateCurrentUser(modelData);
    setOlarkUserInfo(this.user);
    growlProvider.removeValidationGrowls();
    growlProvider.success('Success', 'Your profile has been updated');

    this.auth.handleProfileUpdated(modelData);
    this.domainState.setupUserMenu(this.user.privateDisplayName);

    if (avatarUpdated) {
      this.ea
        .publish(new AvatarChangedEvent({ userId: this.user.userId }));
    }

    this.element.dispatchEvent(new CustomEvent('profile-saved', { bubbles: true }));
  }

  handlePasswordSaved() {
    growlProvider.removeValidationGrowls();
    growlProvider.success('Success', 'Your password has been updated');
    this.element.dispatchEvent(new CustomEvent('password-saved', { bubbles: true }));
  }

  _updateCurrentUser(model) {
    this.user.firstName = model.firstName;
    this.user.lastName = model.lastName;
    this.user.timeZone = model.timeZone || moment.tz.guess();
  }
}
