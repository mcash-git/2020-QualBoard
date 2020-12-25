import { computedFrom } from 'aurelia-framework';
import { growlProvider } from 'shared/growl-provider';
import { DialogService } from 'aurelia-dialog';
import { DomainState } from 'shared/app-state/domain-state';
import { OidcWrapper } from 'shared/auth/oidc-wrapper';
import { CurrentUser } from 'shared/current-user';
import { CurrentUserRole } from 'shared/current-user-role';
import { ViewState } from 'shared/app-state/view-state';
import { MessagingClient } from '2020-messaging';

export class AppHead {
  static inject = [
    Element,
    DomainState,
    OidcWrapper,
    DialogService,
    CurrentUser,
    CurrentUserRole,
    MessagingClient,
    ViewState,
  ];

  constructor(
    element,
    domainState,
    auth,
    modalService,
    user,
    userRole,
    messaging,
    viewState,
  ) {
    this.element = element;
    this.domainState = domainState;
    this.auth = auth;
    this.modalService = modalService;
    this.user = user;
    this.userRole = userRole;
    this.domainState.setupUserMenu(this.user.privateDisplayName);
    this.messaging = messaging;
    this.viewState = viewState;
    this.breadcrumbView = 'mini';

    this.appVersion = window.VERSION;
    this.isOlarkAvailable = window.olark && typeof window.olark === 'function';
  }

  attached() {
    document.addEventListener('new-notification', () => {
      if (this.isResearcherRoute) {
        this.fetchNotificationsCount();
      }
    });
    document.addEventListener('notification-read', () => {
      if (this.isResearcherRoute) {
        this.fetchNotificationsCount();
      }
    });
  }

  async fetchNotificationsCount() {
    const data = await this.messaging.notifications.getCounts();
    this.domainState.unreadNoticeCount = data.totalUnread || 0;
  }

  showOlark() {
    if (!this.isOlarkAvailable) {
      growlProvider.info('Olark not available', 'Olark is only available in the production ' +
        'environment.  If you are seeing this in production, something went wrong.');
      return;
    }

    window.olark('api.box.expand');
  }

  copyAccessTokenToClipboard() {
    const textarea = document.createElement('textarea');
    textarea.style.width = '0px';
    textarea.style.height = '0px';
    textarea.value = this.auth.accessToken;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    growlProvider.success('Copied', 'The access token has been copied to the clipboard.');
  }

  hide() {
    this.viewState.moderatorToolsOpen = !this.viewState.moderatorToolsOpen;
  }

  @computedFrom('viewState.parentStateStack.current.title')
  get title() {
    const parentState = this.viewState.parentStateStack.current;
    return parentState && parentState.title;
  }

  @computedFrom('viewState.parentStateStack.current.isParticipantRoute')
  get isParticipantRoute() {
    return this.viewState.parentStateStack.current &&
      this.viewState.parentStateStack.current.isParticipantRoute;
  }

  @computedFrom('viewState.parentStateStack.current.isResearcherRoute')
  get isResearcherRoute() {
    return this.viewState.parentStateStack.current &&
      this.viewState.parentStateStack.current.isResearcherRoute;
  }

  @computedFrom('userRole')
  get canHaveDownloads() {
    return this.userRole.isSuperUser() || this.userRole.isModerator();
  }
}
