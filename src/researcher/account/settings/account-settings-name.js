import { bindable, bindingMode, computedFrom } from 'aurelia-framework';
import { Validator, ValidationRule } from '2020-aurelia';
import { Api } from 'api/api';
import { DomainState } from 'shared/app-state/domain-state';
import { growlProvider } from 'shared/growl-provider';
import { AccountModel } from 'researcher/account/account-model';

export class AccountSettingsName {
  static inject = [Api, DomainState];
  constructor(api, domainState) {
    this.api = api;
    this.domainState = domainState;
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) account;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) editing;

  activate(model) {
    this.account = model.account;
  }

  async accountChanged(newValue) {
    if (!(newValue instanceof AccountModel)) {
      throw new Error('account must be an instance of AccountModel');
    }
    this._setUpValidation();
    this._setEdit();
    this.allAccountNamesLowerCase =
      (await this.api.query.accounts.getAllNames())
        .map(name => name.toLowerCase());
  }

  editClick() {
    this.editing = 'name';
  }

  saveClick() {
    this._save();
  }

  cancelClick() {
    this._setEdit();
    this.editing = undefined;
  }

  // "private" methods

  _setEdit() {
    this.edit = this.account.clone();
    this.validator.clear();
  }

  _setUpValidation() {
    const validator = new Validator(this);
    validator.registerRule(new ValidationRule({
      property: 'edit.name',
      validate: value => value && value.trim(),
      message: 'Please include a name for the account.',
    }));
    validator.registerRule(new ValidationRule({
      property: 'edit.name',
      validate: (value, model) => {
        const trimmed = value.trim().toLowerCase();
        return (model.allAccountNamesLowerCase
          .find(name => name === trimmed) === undefined) ||
            trimmed === model.account.name.trim().toLowerCase();
      },
      message: 'An account with that name already exists.',
      runIf: value => value && value.trim(),
    }));
    this.validator = validator;
  }

  _validate() {
    const validationResult = this.validator.validate();

    if (validationResult.isValid) {
      return true;
    }

    const errors = ['Please correct the following error(s):', ...validationResult.errors];

    growlProvider.warning('Unable to save', errors.join('<br />'), { timeout: false });

    return false;
  }

  async _save() {
    if (!this._validate()) {
      return;
    }
    const result = await this.api.command.accounts.setName(this.edit);
    if (result.error) {
      growlProvider.error('Error', 'There was an error saving your changes.  Please try again.');
      return;
    }
    this.domainState.header.title = this.edit.name;
    this.account.name = this.edit.name;
    this.editing = undefined;
  }

  @computedFrom('editing')
  get isEditing() {
    return this.editing === 'name';
  }
}
