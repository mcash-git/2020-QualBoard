import { ViewState } from 'shared/app-state/view-state';
import { ChildViewState } from 'shared/app-state/child-view-state';
import configureUnknownRoutes from 'shared/utility/configure-unknown-routes';
import { MediaGalleryActionBarModel }
  from './media/media-gallery-action-bar-model';

const participantMedia = 'participant-media';
const moderatorMedia = 'moderator-media';
const clips = 'clips';

export class MediaGallery {
  static inject = [ViewState];

  constructor(viewState) {
    this.viewState = viewState;
  }

  activate() {
    this.viewState.childStateStack.push(new ChildViewState({
      actionBarViewModel: 'researcher/project/media/media-gallery-action-bar',
      actionBarModel: new MediaGalleryActionBarModel({
        router: this.router,
      }),
    }));
  }

  deactivate() {
    this.viewState.childStateStack.pop();
  }

  configureRouter(config, router) {
    config.map([
      {
        route: ['', 'participant'],
        name: participantMedia,
        moduleId: './media/participant-media',
        nav: true,
        title: 'Participant Media',
      },
      {
        route: ['moderator'],
        name: moderatorMedia,
        moduleId: './media/moderator-media',
        nav: true,
        title: 'Moderator Media',
      },
      {
        route: ['clips'],
        name: clips,
        moduleId: './media/video-clips',
        nav: true,
        title: 'Clips',
      },
    ]);

    configureUnknownRoutes(config);
    this.router = router;
  }
}
