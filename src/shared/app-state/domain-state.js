export class DomainState {
  constructor() {
    this.header = {
      subNav: null,
      title: null,
      subtitle: null,
      userMenu: {
        title: null,
        list: null,
      },
    };
    this.sideBar = {
      projects: null,
      // TODO:  Wire this up.
      accounts: null,
    };

    this.account = null;
    this.accountId = null;
    this.project = null;
    this.individualActivity = null;

    this.moderatorProjects = null;
    this.participantProjects = null;
    this.events = null;

    this.unreadNoticeCount = 0;
  }
  
  currentProjectUser = null;

  setupUserMenu(userTitle) {
    this.header.userMenu = {
      title: userTitle,
      // icon: 'ion-ios-person',
      items: [
        { name: 'profile', event: 'openProfile' },
        { name: 'logout', event: 'logout' },
      ],
    };
  }
}
