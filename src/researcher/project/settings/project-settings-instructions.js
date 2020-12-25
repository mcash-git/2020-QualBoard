import { computedFrom, bindable, bindingMode } from 'aurelia-framework';
import { Api } from 'api/api';
import { DomainState } from 'shared/app-state/domain-state';
import { growlProvider } from 'shared/growl-provider';

export class ProjectSettingsInstructions {
  static inject = [Api, DomainState];
  constructor(api, domainState) {
    this.api = api;
    this.domainState = domainState;
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) project;

  activate(model) {
    this.project = model.project;
  }

  projectChanged() {
    this._setEdit();
  }

  editClick() {
    this.project.editing = 'instructions';
  }

  saveClick() {
    this._save();
  }

  cancelClick() {
    this._setEdit();
    this.project.editing = undefined;
  }

  // "private" methods

  _setEdit() {
    this.edit = {
      title: this.project.instructionTitle,
      text: this.project.instructionText,
      media: this.project.instructionMedia,
      id: this.project.id,
    };
  }

  async _save() {
    const result = await this.api.command.projects.setInstructions(this.edit);
    if (result.error) {
      growlProvider.error('Error', 'There was an error saving your changes.  Please try again.');
      return;
    }

    this.project.instructionTitle = this.edit.title;
    this.domainState.project.instructionTitle = this.edit.title;

    this.project.instructionText = this.edit.text;
    this.domainState.project.instructionText = this.edit.text;

    this.project.instructionMedia = this.edit.media;
    this.domainState.project.instructionMedia = this.edit.media;

    this.project.editing = undefined;
  }

  @computedFrom('project.editing')
  get isEditing() {
    return this.project.editing === 'instructions';
  }
}
