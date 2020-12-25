import { computedFrom } from 'aurelia-framework';
import { ViewState } from 'shared/app-state/view-state';
import { AssetTypes } from '2020-media';
import { DomainState } from 'shared/app-state/domain-state';
import { enums } from '2020-qb4';
import get from 'lodash.get';

const ProjectRoles = enums.projectRoles;

export class MediaItemModal {
  static inject = [ViewState, DomainState];

  constructor(viewState, domainState) {
    this.viewState = viewState;
    this.domainState = domainState;
  }

  activate(model) {
    // this.modalController.settings.centerHorizontalOnly = true;
    this.mediaItems = model.mediaItems || [model.mediaItem];
    this.canEdit = model.canEdit;
    this.index = model.index || 0;
    this.canAddInsights = model.canAddInsights;
    this.projectId = model.projectId;
    this.boundKeyDownHandler = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this.boundKeyDownHandler);
  }

  detached() {
    window.removeEventListener('keydown', this.boundKeyDownHandler);
  }

  @computedFrom('domainState.currentProjectUser.role')
  get currentUserIsModerator() {
    return get(this, 'domainState.currentProjectUser.role') === ProjectRoles.moderator.int;
  }

  pausePlayer() {
    if (this.player) {
      this.player.pause();
    }
  }

  togglePlay() {
    if (this.player) {
      this.player.togglePlay();
    }
  }

  next() {
    this.pausePlayer();
    this.index = this.index === this.mediaItems.length - 1 ? 0 : this.index + 1;
  }

  previous() {
    this.pausePlayer();
    this.index = this.index === 0 ? this.mediaItems.length - 1 : this.index - 1;
  }

  close() {
    // TODO: do dirty check!
    this.viewState.closeModal();
  }

  enterEditMode() {
    this.isEditing = true;
    this.editTitle = this.mediaItem.title;
    this.editDescription = this.mediaItem.description;
  }

  saveChanges() {
    this.mediaItem.title = this.editTitle;
    this.mediaItem.description = this.editDescription;
    this.stopEditing();
  }

  stopEditing() {
    this.isEditing = false;
    this.editTitle = null;
    this.editDescription = null;
  }

  async addInsight() {
    if (!this.canAddInsight) {
      return;
    }

    this.mediaInsightsPanel.tryAdd();
  }

  handleKeyDown(e) {
    if (e.target.matches('input,textarea,select')) {
      return true;
    }

    switch (e.keyCode) {
      case 32:
        this.togglePlay();
        break;
      case 37:
        this.previous();
        break;
      case 39:
        this.next();
        break;
      case 73:
        if (e.ctrlKey) {
          this.addInsight();
        }
        break;
      default:
        break;
    }

    return false;
  }

  @computedFrom('canAddInsights', 'index', 'isEditingInsight')
  get canAddInsight() {
    return this.canAddInsights &&
      AssetTypes[this.mediaItem.type].value === 'Video' &&
      // this.mediaItem.type === AssetTypes.video.int &&
      !this.isEditingInsight;
  }

  @computedFrom('index')
  get mediaItem() {
    return this.mediaItems[this.index];
  }

  @computedFrom('mediaItem.title', 'canEdit')
  get titleText() {
    return this.mediaItem.title || (this.canEdit ? 'Add title' : '');
  }

  @computedFrom('mediaItem.description', 'canEdit')
  get descriptionText() {
    return this.mediaItem.description || (this.canEdit ? 'Add description' : '');
  }

  @computedFrom('isEditing', 'mediaItems.length')
  get isPrevNextDisabled() {
    return this.isEditing || this.mediaItems.length === 1;
  }
}
