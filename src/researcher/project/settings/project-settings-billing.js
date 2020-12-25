import { computedFrom, bindable, bindingMode } from 'aurelia-framework';
import { Api } from 'api/api';
import { DomainState } from 'shared/app-state/domain-state';
import { growlProvider } from 'shared/growl-provider';

export class ProjectSettingsBilling {
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
    this.project.editing = 'billing';
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
      closeoutId: this.project.closeoutId,
      id: this.project.id,
    };
  }

  _save() {
    growlProvider.removeValidationGrowls();

    this.api.command.projects.setCloseoutId(this.edit).then(result => {
      if (result.error) {
        growlProvider.error('Error', 'There was an error saving your changes');
        return;
      }
      this.project.closeoutId = this.edit.closeoutId;
      this.project.editing = undefined;
    });
  }

  @computedFrom('project.editing')
  get isEditing() {
    return this.project.editing === 'billing';
  }
}
