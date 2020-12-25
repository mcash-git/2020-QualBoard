import { Api } from 'api/api';
import { DialogController } from 'aurelia-dialog';
import { Validator, ValidationRule } from '2020-aurelia';
import { growlProvider } from 'shared/growl-provider';
import { AccountModel } from 'researcher/account/account-model';

export class CreateAccountModal {
  static inject = [Api, DialogController];

  constructor(api, dialogController) {
    this.api = api;
    this.modalController = dialogController;
  }

  async activate() {
    this.accountModel = new AccountModel();
    this.allAccountNamesLowerCase =
      (await this.api.query.accounts.getAllNames())
        .map(name => name.toLowerCase());
    this._setUpValidation();
  }

  async save() {
    growlProvider.removeValidationGrowls();
    if (!this._validate()) {
      return;
    }

    const result = await this.api.command.accounts.create(this.accountModel);

    if (result.error) {
      return;
    }

    this.modalController.ok(result);
  }

  cancelButtonClick() {
    growlProvider.removeValidationGrowls();
    this.modalController.cancel();
  }

  keydown(event) {
    if (event.keyCode !== 13) {
      return true;
    }

    this.save();
    return false;
  }

  _setUpValidation() {
    const validator = new Validator(this);

    validator.registerRule(new ValidationRule({
      property: 'accountModel.name',
      validate: value => value && value.trim(),
      message: 'Please include a name for the account.',
    }));

    validator.registerRule(new ValidationRule({
      property: 'accountModel.name',
      validate: (value, model) => model.allAccountNamesLowerCase
        .find(name => name === value.trim().toLowerCase()) === undefined,
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

    const errors = [...validationResult.errors];

    growlProvider.error('Unable to Save', errors.join('<br />'), { class: 'validation-error' });

    return false;
  }
}
