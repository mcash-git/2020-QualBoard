import { bindable, bindingMode, computedFrom } from 'aurelia-framework';
import { Api } from 'api/api';
import { DomainState } from 'shared/app-state/domain-state';
import { growlProvider } from 'shared/growl-provider';

export class IndividualActivitySettingsDefaultModerator {
  static inject = [Api, DomainState];

  constructor(api, domainState) {
    this.api = api;
    this.domainState = domainState;
  }

  @bindable({ defaultBindingMode: bindingMode.oneWay }) ia;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) moderators;

  activate(model) {
    this.ia = model.ia;
    this.moderators = model.moderators;
  }

  bind() {
    this.defaultModerator = this.moderators
      .find(m => m.userId === this.ia.defaultModeratorUserId);
    this._setEdit();
    this.projectUsersUrl = `/#/accounts/${this.domainState.project.accountId
    }/projects/${this.ia.projectId}/users`;
  }

  editClick() {
    this.ia.editing = 'moderator';
  }

  saveClick() {
    this._save();
  }

  cancelClick() {
    this._setEdit();
    this.ia.editing = undefined;
  }

  selectModerator(mod) {
    this.edit.defaultModerator = mod;
    this.edit.defaultModeratorUserId = mod.userId;
  }

  _setEdit() {
    this.edit = {
      projectId: this.ia.projectId,
      iaId: this.ia.id,
      defaultModeratorUserId: this.ia.defaultModeratorUserId,
      defaultModerator: this.defaultModerator,
    };
  }

  async _save() {
    if (this.edit.defaultModerator.userId !== this.ia.defaultModeratorUserId) {
      const result = await this.api.command.individualActivities
        .setDefaultModerator(this.edit);
      if (result.error) {
        growlProvider.error('Error', 'There was an error saving your changes.  Please try again.');
        return;
      }
      this.ia.defaultModeratorUserId = this.edit.defaultModerator.userId;
      this.defaultModerator = this.edit.defaultModerator;
      this.domainState.individualActivity.defaultModeratorUserId =
        this.edit.defaultModerator.userId;
    }
    this.ia.editing = undefined;
  }

  @computedFrom('ia.editing')
  get isEditing() {
    return this.ia.editing === 'moderator';
  }
}
