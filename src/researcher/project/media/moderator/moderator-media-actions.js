import { bindable, bindingMode, computedFrom } from 'aurelia-framework';
import { MediaClient } from '2020-media';
import { DialogService } from 'aurelia-dialog';
import { DomainState } from 'shared/app-state/domain-state';
import { CurrentUser } from 'shared/current-user';
import { MediaActionsService } from '../media-actions-service';

export class ModeratorMediaActions {
  static inject = [
    Element,
    MediaClient,
    DialogService,
    DomainState,
    CurrentUser,
  ];

  constructor(element, mediaClient, dialogService, domainState, user) {
    this.element = element;
    this.service = new MediaActionsService({
      element,
      mediaClient,
      dialogService,
      domainState,
      user,
    });
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) assets;

  download() {
    return this.service.download(this.assets);
  }

  async delete() {
    const success = await this.service.delete(this.assets);

    if (!success) {
      return;
    }

    this.assets = [];
  }

  @computedFrom('assets.length')
  get isSelecting() {
    return this.assets && this.assets.length > 0;
  }

  uploadClick() {
    this.element.dispatchEvent(new CustomEvent('upload-click', {
      bubbles: true,
    }));
  }

  @computedFrom('assets.length')
  get downloadExportButtonText() {
    return (this.assets.length > 1) ? 'Export' : 'Download';
  }
}
