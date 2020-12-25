import { observable, computedFrom } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { Validator } from '2020-aurelia';
import { IdentityClient } from '2020-identity';
import { Api } from 'api/api';
import { growlProvider } from 'shared/growl-provider';
import { enums } from '2020-qb4';
import { rules as validationRules } from './create-project-user-modal-validation';

export class CreateProjectUserModal {
  static inject = [DialogController, Api, IdentityClient];

  constructor(modalController, api, identityClient) {
    this.modalController = modalController;
    this.api = api;
    this.identityClient = identityClient;

    this.projectRoles = enums.projectRoles;
  }

  @observable role;

  activate(model) {
    this.availableGroupTags = model.availableGroupTags;
    this.userProject = {
      projectId: model.projectId,
      role: null,
      displayName: null,
      groupTags: [],
    };
    this.createCommand = {
      projectId: model.projectId,
      email: null,
      firstName: null,
      lastName: null,
      userProject: this.userProject,
      customRedirectClientUrl: window.location.origin,
      emailOption: 'DoNotSend',
    };
    this.lockToRole = model.lockToRole;
    if (this.isRoleLocked) {
      this.role = this.projectRoles.find(r => r.int === this.lockToRole);
    }
    this._setUpValidation();
  }

  roleChanged(current, previous) {
    const isChangeToParticipant = current && current.value === 'Participant' &&
      (!previous || previous.value !== 'Participant');
    const isChangeFromParticipant = previous && previous.value === 'Participant' &&
      (!current || current.value !== 'Participant');
    if (isChangeToParticipant) {
      this.groupTags = this.stashedGroupTags || [];
    } else if (isChangeFromParticipant) {
      this.stashedGroupTags = this.groupTags;
      this.groupTags = [];
    }
  }

  async save() {
    if (!this._validate()) {
      return;
    }

    if (this.role.value === 'Participant') {
      const saveTagsSuccess = await this._saveNewTags();

      if (!saveTagsSuccess) {
        return;
      }

      this.userProject.groupTags = this.groupTags.map(t => t.id);
    }

    this.userProject.role = this.role.value;

    try {
      const users = await this.identityClient.createProjectUsers(this.createCommand);
      this.modalController.ok(users);
    } catch (e) {
      console.error('Encountered an error trying to save the user:', e);
      growlProvider.error('Error', 'There was an error saving the new tags.');
    }
  }

  // "private" methods:

  async _saveNewTags() {
    const appliedNewTags = this.groupTags.filter(t => !t.id);

    if (appliedNewTags.length > 0) {
      const result = await this.api.command.groupTags.batchCreate({
        projectId: this.userProject.projectId,
        newTags: appliedNewTags,
      });

      if (result.error) {
        growlProvider.error('Error', 'There was an error saving the new tags.');
        return false;
      }
    }

    return true;
  }

  _setUpValidation() {
    const validator = new Validator(this);
    validationRules.forEach(rule => validator.registerRule(rule));
    this.validator = validator;
  }

  _validate() {
    growlProvider.removeValidationGrowls();
    const validationResult = this.validator.validate();

    if (validationResult.isValid) {
      return true;
    }

    const errors = [...validationResult.errors];

    growlProvider.error('Unable to Save', errors.join('<br />'), { class: 'validation-error' });

    return false;
  }

  @computedFrom('lockToRole')
  get isRoleLocked() {
    return this.lockToRole !== undefined && this.lockToRole !== null;
  }
}
