import { growlProvider } from '../../../shared/growl-provider';

export class MediaActionsService {
  constructor({
    element,
    mediaClient,
    dialogService,
    domainState,
    user,
  }) {
    this.element = element;
    this.mediaClient = mediaClient;
    this.dialogService = dialogService;
    this.domainState = domainState;
    this.user = user;
  }

  download(assets) {
    if (!assets || assets.length === 0) {
      return;
    }

    if (assets.length === 1) {
      this.mediaClient.downloadAsset(assets[0].id);
      return;
    }

    this.dialogService.open({
      viewModel: 'shared/media/text-prompt-modal',
      model: {
        title: 'Export Media',
        body: 'Name Your Export',
        placeholderText: 'File Name',
        defaultValue: `${this.domainState.project.privateName} - QualBoard Media`,
      },
    }).whenClosed(async modalResult => {
      if (modalResult.wasCancelled) {
        return;
      }

      const success = await this.mediaClient.exportAssets({
        assetIds: assets.map(a => a.id),
        fileName: modalResult.output || null,
      });

      if (success) {
        growlProvider.success('Export Started', 'Your export request has been successfully received. When the export completes, you can download it from the Downloads section in the title bar.');
      } else {
        growlProvider.error('Error', 'There was an error processing your export request; please try again.  If the problem persists, contact support.');
      }
    });
  }

  async delete(assets) {
    if (!assets || assets.length === 0) {
      return;
    }

    this.dialogService.open({
      viewModel: 'shared/components/confirmation-modal',
      model: {
        text: `Are you sure you want to delete this media ${
          assets.length === 1 ? '' : `(${assets.length} files) `
        }from the system?`,
        title: 'Delete Confirmation',
        confirmButtonClass: 'btn-danger',
        confirmButtonText: 'Delete',
        cancelButtonClass: 'btn-outline-secondary',
      },
    }).whenClosed(async result => {
      if (result.wasCancelled) {
        return;
      }

      const success = await this.mediaClient.deleteAssets(assets.map(a => a.id));
      if (!success) {
        growlProvider.warning('Error', 'There was an error deleting your media. Please try again; if the problem persists, contact support.');
        return;
      }

      this.element.dispatchEvent(new CustomEvent('select-page', {
        bubbles: true,
        detail: { pageNumber: 1 },
      }));
    });
  }
}
