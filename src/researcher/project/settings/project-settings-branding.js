import { computedFrom, bindable, bindingMode } from 'aurelia-framework';
import { Api } from 'api/api';
import { DomainState } from 'shared/app-state/domain-state';

export class ProjectSettingsBranding {
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
    this.project.editing = 'branding';
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
      privateName: this.project.privateName,
      publicName: this.project.publicName,
      id: this.project.id,
    };
  }

  _save() {

  }

  @computedFrom('project.editing')
  get isEditing() {
    return this.project.editing === 'branding';
  }
}
