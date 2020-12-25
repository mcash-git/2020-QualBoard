import { computedFrom, bindable, bindingMode } from 'aurelia-framework';
import { Validator, ValidationRule } from '2020-aurelia';
import { Api } from 'api/api';
import { DomainState } from 'shared/app-state/domain-state';
import { growlProvider } from 'shared/growl-provider';

export class IndividualActivitySettingsName {
  static inject = [Api, DomainState];
  constructor(api, domainState) {
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
  this.ia.editing = 'name';
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

_setEdit() {
  this.edit = {
    privateName: this.ia.privateName,
    publicName: this.ia.publicName,
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
  this.api.command.individualActivities.setName(this.edit).then(result => {
    if (result.error) {
      growlProvider.error('Error', 'There was an error saving your changes.');
      return;
    }
    this.domainState.header.subtitle = this.edit.privateName;
    this.ia.privateName = this.edit.privateName;
    this.ia.publicName = this.edit.publicName;
    this.ia.editing = undefined;
  });
}
  
  @computedFrom('ia.editing')
get isEditing() {
  return this.ia.editing === 'name';
}
}
