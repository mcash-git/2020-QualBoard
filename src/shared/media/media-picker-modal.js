import { DialogController } from 'aurelia-dialog';
import { MediaClient } from '2020-media';
import { Api } from 'api/api';
import { growlProvider } from 'shared/growl-provider';
import { enums } from '2020-qb4';
// TODO:  Move this:
import { DateTimeService } from 'shared/components/date-time-service';

export class MediaPickerModal {
  static inject = [
    Api,
    MediaClient,
    DialogController,
    DateTimeService,
  ];

  constructor(
    api,
    mediaClient,
    modalController,
    dateTimeService,
  ) {
    this.api = api;
    this.mediaClient = mediaClient;
    this.modalController = modalController;
    this.dateTimeService = dateTimeService;
  }

  selectedAssets = [];

  async canActivate({
    accountId = null,
    projectId = null,
    userRole = 3,
    pageSize = 10,
    page = 1,
    projectUserDisplayName = null,
    eventName = null,
    assetScope,
  } = {}) {
    if (projectId === null) {
      return false;
    }

    this.accountId = accountId;
    this.projectId = projectId;
    this.projectUserDisplayName = projectUserDisplayName;
    this.eventName = eventName;
    this.canSelectMultiple = true;
    this.pageSize = pageSize;
    this.userRole = enums.projectRoles.find(r => r.int === userRole);
    this.assetScope = assetScope;

    await this.loadPage(page);
    this.escHandler = event => {
      if (document.activeElement === this.addFilesButton) {
        this.addFilesButton.blur();
      } else if (event.keyCode === 27 && !this.mediaUploadArea.hasFocus) {
        this.close();
      } else {
        document.activeElement.blur();
      }
    };
    this.clickHandler = event => {
      if (!event.target.closest('.modal-container')) {
        this.close();
      }
    };
    window.addEventListener('click', this.clickHandler);
    window.addEventListener('keyup', this.escHandler);
    this.selectedAssets = [];
    this.deselectPreviousUploads();
    return true;
  }

  handleSelectPage(event) {
    this.loadPage(event.detail.pageNumber, event.detail.uploadingAssets);
  }

  async loadPage(pageNumber, newUploads) {
    const result = await this.mediaClient.getAssetsForProject({
      projectId: this.projectId,
      includedScopes: this.userRole.value === 'Participant' ? 1 : 2,
      onlyMine: this.userRole.value === 'Participant',
      pageSize: this.pageSize,
      page: pageNumber,
    });
    this.currentPage = result;

    this.matchUploadsAndAssets();
    this.matchSelectedFromPage();

    // if the user just uploaded, we select depending on whether multi-select
    // is enabled..
    if (newUploads) {
      if (this.canSelectMultiple) {
        newUploads.forEach(asset => {
          asset.isSelected = true;
        });

        this.selectedAssets = this.selectedAssets.concat(newUploads);
      } else {
        this.selectedAssets.forEach(a => { a.isSelected = false; });
        this.selectedAssets = [newUploads[newUploads.length - 1]];
      }
    }
  }

  confirmSelectedAssets() {
    this._finalize();
    this.modalController.ok({ selectedAssets: this.selectedAssets });
  }

  close() {
    this._finalize();
    this.modalController.cancel();
  }

  matchSelectedFromPage() {
    this.currentPage.items
      .map((item, i) => ({
        item,
        selectedIndex: this.selectedAssets.findIndex(selected => selected.id === item.id),
        index: i,
      }))
      .filter(result => result.selectedIndex !== -1)
      .forEach(result => {
        result.item.isSelected = true;
        this.selectedAssets.splice(result.selectedIndex, 1, result.item);
      });
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

  deselectPreviousUploads() {
    if (this.mediaClient.assetsBeingUploaded) {
      this.mediaClient.assetsBeingUploaded.forEach(asset => {
        asset.isSelected = false;
      });
    }
  }

  async handleDeleteAsset(event) {
    const id = event.detail.assetId;

    const result = await this.mediaClient.deleteAsset(id);

    if (result.error) {
      growlProvider.warning('Error', 'There was an error attempting to delete the asset.  Please try again; if the problem persists, contact support.');
      console.error('Error attempting to delete the asset: ', result); // eslint-disable-line
      return;
    }

    this.handleAssetsRemoved([id]);
  }

  async handleCancelAssetUpload(event) {
    const id = event.detail.assetId;

    const result = await this.mediaClient.cancelUpload(id);

    if (!result.ok) {
      growlProvider.warning('Error', 'There was an error cancelling the upload.  Please try again; if the problem persists, contact support.');
      return;
    }

    this.handleAssetsRemoved([id]);
  }

  async handleAssetsRemoved(ids) {
    const unselectAndFilter = a => {
      if (ids.some(id => a.id === id)) {
        a.isSelected = false;
        return false;
      }
      return true;
    };

    this.selectedAssets = this.selectedAssets.filter(unselectAndFilter);

    // this.currentPage is the summary object which contains a property
    // `currentPage` which indicates which page number is currently loaded.
    this.loadPage(this.currentPage.currentPage);
  }

  attachNames(fileList) {
    if (!this.eventName || !this.projectUserDisplayName) {
      return;
    }

    const nameBase = `[${this.projectUserDisplayName}]_[${
      this.eventName}]_[${
      this.dateTimeService.getUserNow('YYYY-MM-DD_hh:mm:ss')}]`;

    if (fileList.length === 1) {
      fileList[0].customName = nameBase;
    } else if (fileList.length > 1) {
      Array.prototype.forEach.call(fileList, (file, i) => {
        file.customName = `${nameBase}_${i + 1}`;
      });
    }
  }

  _finalize() {
    window.removeEventListener('keyup', this.escHandler);
    window.removeEventListener('click', this.clickHandler);
  }
}
