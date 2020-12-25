import { ViewState } from 'shared/app-state/view-state';
import { ParentViewState } from 'shared/app-state/parent-view-state';
import configureUnknownRoutes from 'shared/utility/configure-unknown-routes';

export class Projects {
  static inject = [ViewState];

  constructor(viewState) {
    this.viewState = viewState;
  }

  activate() {
    this.viewState.parentStateStack.push(new ParentViewState({
      title: 'Dashboard',
      titleIcon: 'icon-home',
      navItems: this.router.navigation,
    }));
  }

  deactivate() {
    this.viewState.parentStateStack.pop();
  }

  configureRouter(config, router) {
    config.map([
      {
        route: ['', 'projects'],
        name: 'my-projects',
        moduleId: './my-projects',
        nav: false,
        title: 'My Projects',
      },
      {
        route: ['projects/:projectId'],
        name: 'project',
        moduleId: 'observer/project/project',
        nav: false,
        title: 'Project',
        settings: {
          breadIcon: 'icon-folder',
        },
      },
    ]);

    configureUnknownRoutes(config);
    this.router = router;
  }
}
