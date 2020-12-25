import configureUnknownRoutes from 'shared/utility/configure-unknown-routes';

export class Accounts {
  configureRouter(config, router) {
    config.map([
      {
        route: ['', 'accounts'],
        name: 'accounts',
        moduleId: './my-accounts',
        nav: true,
        title: 'Accounts',
        settings: {
          class: 'icon-business_center',
        },
      },
      {
        route: [':accountId'],
        name: 'account',
        moduleId: './account',
        nav: false,
        title: 'Projects',
        settings: {
          class: 'icon-home',
          breadIcon: 'icon-business_center',
        },
      },
    ]);

    configureUnknownRoutes(config);
    this.router = router;
  }
}
