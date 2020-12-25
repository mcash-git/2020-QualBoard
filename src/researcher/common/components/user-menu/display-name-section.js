import { bindable } from 'aurelia-framework';
import { growlProvider } from 'shared/growl-provider';
import { IdentityClient } from '2020-identity';
import { Validator, ValidationRule } from '2020-aurelia';

export class DisplayNameSection {
  static inject = [Element, IdentityClient];

  constructor(element, identityClient) {
    this.element = element;
    this.identityClient = identityClient;
  }

  @bindable allProjectUsers;
  @bindable projectUser;

  bind() {
    this.allDisplayNames = new Set(this.allProjectUsers.map(pu => pu.displayName.toLowerCase()));
    this.originalDisplayName = this.projectUser.displayName;
    this.editDisplayName = this.originalDisplayName;
    this._setUpValidation();
  }

  handleBlur() {
    this.editDisplayName = this.editDisplayName.trim();
    if (!this.editDisplayName) {
      this.reset();
    }

    if (this.editDisplayName === this.originalDisplayName) {
      setImmediate(() => this.validator.clear());
    }
  }

  reset() {
    this.editDisplayName = this.originalDisplayName;
    setImmediate(() => this.validator.clear());
  }

  async saveDisplayName() {
    growlProvider.removeValidationGrowls();
    if (!this._validate()) {
      return;
    }

    try {
      await this.identityClient.setDisplayName({
        userId: this.projectUser.userId,
        projectId: this.projectUser.projectId,
        displayName: this.editDisplayName.trim(),
      });

      this.originalDisplayName = this.editDisplayName;

      growlProvider.success('Success!', `The user's display name has successfully been changed to "${
        this.editDisplayName}"`);
      this.projectUser.displayName = this.editDisplayName;
      const projectUser = this.allProjectUsers.find(pu => pu.userId === this.projectUser.userId);
      projectUser.displayName = this.editDisplayName;
    } catch (e) {
      console.error('Encountered an error attempting to update a display name:', e);
      growlProvider.error(
        'Error',
        'There was an error updating the user\'s display name.  Please try again.  ' +
        'If the problem persists, contact support.',
      );
    }
  }

  _setUpValidation() {
    const validator = new Validator(this);
    validator.registerRule(new ValidationRule({
      property: 'editDisplayName',
      validate: val => val,
      message: 'Display name cannot be blank',
    }));
    this.validator = validator;
  }

  _validate() {
    const validationResult = this.validator.validate();

    if (validationResult.isValid) {
      return true;
    }

    const errors = [...validationResult.errors];

    growlProvider.error(
      'Unable to update display name', errors.join('<br />'),
      { class: 'validation-error' },
    );

    return false;
  }
}
