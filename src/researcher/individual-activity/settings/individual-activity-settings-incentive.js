import { computedFrom, bindable, bindingMode } from 'aurelia-framework';
import { Validator, ValidationRule } from '2020-aurelia';
import { Api } from 'api/api';
import { DomainState } from 'shared/app-state/domain-state';
import { growlProvider } from 'shared/growl-provider';

export class IndividualActivitySettingsIncentive {
  static inject = [Api, DomainState];
  constructor(api, growl, domainState) {
    this.api = api;
    this.domainState = domainState;
  }

@bindable({ defaultBindingMode: bindingMode.twoWay }) ia;

activate(model) {
  this.ia = model.ia;
}

iaChanged() {
  this._setUpValidation();
  this._setEdit();
}

editClick() {
  this.ia.editing = 'incentive';
}

saveClick() {
  this._save();
}

cancelClick() {
  growlProvider.removeValidationGrowls();
  this._setEdit();
  this.ia.editing = undefined;
}

  // "private" methods

_setUpValidation() {
  const posInt = value => {
    const i = parseInt(value, 10);
    return isNaN(i) ? false : i >= 0;
  };

  const validator = new Validator(this);
  validator.registerRule(new ValidationRule({
    property: 'edit.incentiveAmount',
    validate: posInt,
    message: 'Please enter an incentive amount greater than or equal to 0.',
  }));

  this.validator = validator;
}

_setEdit() {
  this.edit = {
    incentiveAmount: this.ia.incentiveAmount,
    projectId: this.ia.projectId,
    id: this.ia.id,
  };
  this.validator.clear();
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
  this.api.command.individualActivities.setIncentive(this.edit).then(result => {
    if (result.error) {
      growlProvider.error('Error', 'There was an error saving your changes.');
      return;
    }
    this.ia.incentiveAmount = this.edit.incentiveAmount;
    this.ia.editing = undefined;
  });
}

  @computedFrom('ia.editing')
get isEditing() {
  return this.ia.editing === 'incentive';
}
}
