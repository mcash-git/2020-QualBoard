import { computedFrom } from 'aurelia-framework';
import get from 'lodash.get';

export class ProjectUsersActionBar {
  activate(model) {
    this.model = model;
  }

  @computedFrom('model.user.isSuperUser', 'model.myProjectUser')
  get shouldShowAddSelfOption() {
    return get(this, 'model.user.isSuperUser') &&
      (!this.model.myProjectUser || this.model.myProjectUser.role.value !== 'Moderator');
  }
}
