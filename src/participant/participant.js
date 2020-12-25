import { ViewState } from 'shared/app-state/view-state';
import { ParentViewState } from 'shared/app-state/parent-view-state';
import configureUnknownRoutes from 'shared/utility/configure-unknown-routes';

export class Participant {
  static inject = [ViewState];

  constructor(viewState) {
    this.viewState = viewState;
  }

  activate() {
    this.viewState.parentStateStack.push(new ParentViewState({
      title: 'My Projects',
      titleIcon: 'icon-home',
      shouldShowContentHeader: false,
      isParticipantRoute: true,
    }));

    const viewportMeta = document.createElement('meta');
    viewportMeta.setAttribute('name', 'viewport');
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
    document.head.appendChild(viewportMeta);
  }

  deactivate() {
    this.viewState.parentStateStack.pop();

    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.parentNode.removeChild(viewportMeta);
    }
  }

  configureRouter(config) {
    config.title = '20|20 Research';
    config.map([
      {
        route: ['projects/:projectId/users/:userId'],
        name: 'participant-project',
        moduleId: 'participant/participant-project',
        nav: false,
        title: 'QualBoard',
        settings: {
          breadIcon: 'icon-folder',
        },
      },
      {
        route: ['', 'dashboard'],
        name: 'participant-dashboard',
        moduleId: 'participant/dashboard/participant-dashboard',
        nav: false,
        title: 'QualBoard',
      },
    ]);

    configureUnknownRoutes(config);
  }
}
