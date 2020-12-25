import { MediaClient } from '2020-media';
import { Api } from 'api/api';
import { ViewState } from 'shared/app-state/view-state';
import { DomainState } from 'shared/app-state/domain-state';
import { MediaGalleryBase } from './media-gallery-base';

export class ModeratorMedia extends MediaGalleryBase {
  static inject = [Api, MediaClient, ViewState, DomainState];

  constructor(api, mediaClient, viewState, domainState) {
    super(api, mediaClient);
    this.viewState = viewState;
    this.domainState = domainState;
  }

  assetScope = 2;

  async canActivate(params) {
    this.projectId = params.projectId;
    await this.loadPage(1);
  }

  activate() {
    const { actionBarModel } = this.viewState.childStateStack.current;
    actionBarModel.currentRoute =
      actionBarModel.router.navigation.find(r => /moderator/i.test(r.title));
    actionBarModel.module = this;
    actionBarModel.viewModel = 'researcher/project/media/moderator/moderator-media-action-bar';
    this.viewState.childStateStack.current.sidebarOpen = false;
    this.accountId = this.domainState.project.accountId;
  }

  async loadPage(pageNumber) {
    const [currentPage, projectUserLookup] = await Promise.all([
      this.mediaClient.getAssetsForProject({
        projectId: this.projectId,
        includedScopes: this.assetScope,
        onlyMine: false,
        pageSize: 24,
        page: pageNumber,
      }),
      this.getProjectUserLookup(),
    ]);

    this.currentPage = currentPage;
    this.currentPage.items.forEach(asset => {
      const owner = projectUserLookup[asset.ownerId];
      asset.ownerDisplayName = owner ? owner.displayName : '20|20 Team';
    });

    this.matchUploadsAndAssets();
    if (this.mediaUploadArea) {
      this.mediaUploadArea.scrollToTop();
    }
  }

  matchUploadsAndAssets() {
    if (!this.mediaClient.assetsBeingUploaded ||
      this.mediaClient.assetsBeingUploaded.length === 0) {
      return;
    }

    this.currentPage.items = this.currentPage.items
      .map(asset => {
        const assetBeingUploaded = this.mediaClient.assetsBeingUploaded
          .find(a => a.id === asset.id);

        if (assetBeingUploaded) {
          assetBeingUploaded.dateCreated = asset.dateCreated;
          assetBeingUploaded.ownerId = asset.ownerId;
          assetBeingUploaded.uploadedBy = asset.uploadedBy;
          return assetBeingUploaded;
        }

        return this.selectedAssets.find(a => a.id === asset.id) || asset;
      });
  }

  async getProjectUserLookup() {
    if (!this.projectUserLookup) {
      this.projectUsers =
        await this.api.query.projectUsers.getProjectUsers(this.projectId);
      this.projectUserLookup = this.projectUsers.reduce((lookup, participant) => {
        lookup[participant.userId] = participant;
        return lookup;
      }, {});
    }

    return this.projectUserLookup;
  }
}
