import { computedFrom, bindable, bindingMode } from 'aurelia-framework';
import { Validator, ValidationRule } from '2020-aurelia';
import { Api } from 'api/api';
import { growlProvider } from 'shared/growl-provider';
import { ViewState } from 'shared/app-state/view-state';

export class ProjectSettingsName {
  static inject = [Api, ViewState];
  constructor(api, state) {
    this.api = api;
    this.state = state.parentStateStack;
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) project;

  activate(model) {
    this.project = model.project;
  }

  projectChanged() {
    this._setUpValidation();
    this._setEdit();
  }

  editClick() {
    this.project.editing = 'name';
  }

  saveClick() {
    this._save();
  }

  cancelClick() {
    growlProvider.removeValidationGrowls();
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
    this.validator.clear();
  }

  _setUpValidation() {
    const validator = new Validator(this);
    validator.registerRule(new ValidationRule({
      property: 'edit.publicName',
      validate: value => value,
      message: 'Please include a public name for the project.',
    }));
    validator.registerRule(new ValidationRule({
      property: 'edit.privateName',
      validate: value => value,
      message: 'Please include a private name for the project.',
    }));
    this.validator = validator;
  }

  _validate() {
    const validationResult = this.validator.validate();

    if (validationResult.isValid) {
      return true;
    }

    const errors = [...validationResult.errors];

    growlProvider.error('Unable to Save', errors.join('<br />'), { class: 'validation-error' });

    return false;
  }

  _save() {
    growlProvider.removeValidationGrowls();
    if (!this._validate()) {
      return;
    }
    this.api.command.projects.setName(this.edit).then(result => {
      if (result.error) {
        growlProvider.error('Error', 'There was an error saving your changes');
        return;
      }

      this.state.current.title = this.edit.privateName;
      this.project.privateName = this.edit.privateName;
      this.project.publicName = this.edit.publicName;
      this.project.editing = undefined;
    });
  }

  @computedFrom('project.editing')
  get isEditing() {
    return this.project.editing === 'name';
  }
}
