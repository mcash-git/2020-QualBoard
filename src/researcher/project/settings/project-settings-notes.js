import { computedFrom, bindable, bindingMode } from 'aurelia-framework';
import { Api } from 'api/api';
import { DomainState } from 'shared/app-state/domain-state';
import { growlProvider } from 'shared/growl-provider';

export class ProjectSettingsNotes {
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
    this.project.editing = 'notes';
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
      notes: this.project.notes,
      id: this.project.id,
    };
  }

  async _save() {
    const result = await this.api.command.projects.setNotes(this.edit);
    if (result.error) {
      growlProvider.error('Error', 'There was an error saving your changes.  Please try again.');
      return;
    }

    this.project.notes = this.edit.notes;
    this.project.editing = undefined;
  }

  @computedFrom('project.editing')
  get isEditing() {
    return this.project.editing === 'notes';
  }
}
