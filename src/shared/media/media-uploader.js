import { bindable, bindingMode } from 'aurelia-framework';
import { MediaClient, SupportedFileTypes } from '2020-media';

export class MediaUploader {
  static inject = [MediaClient];

  constructor(mediaClient) {
    this.mediaClient = mediaClient;
    this.supportedMimes = SupportedFileTypes.map(t => t.mime);
    this.setAccept();
  }

  bind() {
    this.pasteHandler = event => this.handlePaste(event);
    window.addEventListener('paste', this.pasteHandler);
  }

  unbind() {
    window.removeEventListener('paste', this.pasteHandler);
  }

  @bindable({ defaultBindingMode: bindingMode.oneWay }) multiple;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) assetScope;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) onUploadStarted;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) onBeforeUpload;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) accountId;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) projectId;

  files = [];

  async handleFileInputChange() {
    this._handleUploadFiles(this.files);
  }

  async handleFileDrop(files) {
    this._handleUploadFiles(files);
  }

  async _handleUploadFiles(files) {
    if (files.length === 0) {
      return;
    }

    // check if any files are not supported and remove them, then alert user
    if (this.onBeforeUpload && typeof this.onBeforeUpload === 'function') {
      this.onBeforeUpload({ fileList: files });
    }
    const assets = await this.mediaClient.uploadAssets({
      accountId: this.accountId,
      projectId: this.projectId,
      assetScope: this.assetScope,
      fileList: files,
    });

    // check if any files are not supported and remove them, then alert user
    if (this.onUploadStarted && typeof this.onUploadStarted === 'function') {
      this.onUploadStarted({ assets });
    }
  }

  openFileDialog() {
    this.fileInputElement.click();
  }

  setAccept() {
    const extensions = SupportedFileTypes.map(sft => sft.extension);
    const mimes = SupportedFileTypes.map(sft => sft.mime);
    this.accept = extensions.concat(mimes).join(', ');
  }

  handlePaste(event) {
    const clipboardItems =
      (event.clipboardData || event.originalEvent.clipboardData).items;

    this.handleDataTransferItems(clipboardItems);
  }

  // The handling for drag-and-dropping files and pasting an image from the
  // clipboard is identical.
  handleDataTransferItems(items) {
    const files = [];

    Array.prototype.forEach.call(items, item => {
      if (item.kind === 'file' &&
        this.supportedMimes.find(mime => mime === item.type)) {
        files.push(item.getAsFile());
      }
    });

    if (files.length) {
      this._handleUploadFiles(files);
    }
  }
}
