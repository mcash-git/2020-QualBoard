import { bindable, bindingMode } from 'aurelia-framework';
import { MediaClient } from '2020-media';
import { DomainState } from 'shared/app-state/domain-state';
import { ViewState } from 'shared/app-state/view-state';
import { CurrentUser } from 'shared/current-user';

export class MediaGrid {
  static inject = [
    MediaClient,
    DomainState,
    CurrentUser,
    ViewState,
  ];

  constructor(mediaClient, domainState, currentUser, viewState) {
    this.mediaClient = mediaClient;
    this.domainState = domainState;
    this.currentUser = currentUser;
    this.viewState = viewState;

    this.thumbnailShowCount = 4;
    this.shouldShowMore = false;
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) mediaItems;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) projectId;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) canEdit;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) canAddInsights;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) thumbnailShowCount;

  toggleMore(e) {
    e.stopPropagation();
    this.shouldShowMore = !this.shouldShowMore;
  }

  removeItem(e) {
    const { mediaItem } = e.detail;
    const index = this.mediaItems.indexOf(mediaItem);
    this.mediaItems.splice(index, 1);
  }

  async openAsset(e, mediaItem) {
    e.stopPropagation();
    if (mediaItem.viewable) {
      this.openEditModal(mediaItem);
    } else {
      await this.mediaClient.downloadAsset(mediaItem.assetId);
    }
  }

  openEditModal(mediaItem) {
    // TODO: Redo the edit modal.
    this.mediaItems.forEach(f => {
      if (f.assetId !== mediaItem.assetId) {
        f.active = false;
      }
      f.editable = this.canEdit;
    });

    mediaItem.active = true;
    const modalItems = this.mediaItems.filter(item => item.viewable);

    this.viewState.openModal('shared/media/media-item-modal', {
      mediaItems: modalItems,
      index: modalItems.indexOf(mediaItem),
      canEdit: this.canEdit,
      canAddInsights: this.canAddInsights,
      projectId: this.projectId,
    });
  }

  async cancelUpload(event) {
    event.preventDefault();
    event.stopPropagation();

    const { mediaItem } = event.detail;
    // TODO:  Figure out what needs to be passed to the media client.
    await this.mediaClient.cancelUpload(mediaItem.assetId);

    this.removeItem(event);
  }
}
