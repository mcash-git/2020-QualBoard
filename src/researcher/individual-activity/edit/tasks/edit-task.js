import { computedFrom, bindable, bindingMode } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { DomainState } from 'shared/app-state/domain-state';
import { MediaDescriptorModel } from 'shared/media/media-descriptor-model';

export class EditTask {
  static inject = [
    Element,
    DialogService,
    DomainState,
  ];

  constructor(element, dialogService, domainState) {
    this.element = element;
    this.modalService = dialogService;
    this.domainState = domainState;
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) task;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) availableGroupTags;

  dispatchEvent(eventName) {
    this.element.dispatchEvent(new CustomEvent(eventName, {
      bubbles: true,
      detail: { task: this.task },
    }));
  }

  @computedFrom('task', 'task.type')
  get viewModel() {
    return this.task.editViewModel;
  }

  // Opens the media picker
  async openMediaPicker() {
    if (this.hasResponse) {
      return;
    }

    const assetScope = 2;

    this.modalService.open({
      lock: true,
      enableEscClose: false,
      viewModel: 'shared/media/media-picker-modal',
      model: {
        accountId: this.domainState.project.accountId,
        projectId: this.domainState.project.id,
        canSelectMultiple: true,
        assetScope,
        userRole: 0,
      },
    }).whenClosed(result => {
      if (result.wasCancelled) {
        return;
      }

      this.task.media = this.task.media
        .concat(result
          .output
          .selectedAssets.map(a => MediaDescriptorModel.fromAsset(a)));
    });
  }
}
