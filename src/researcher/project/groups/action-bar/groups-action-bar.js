import { Api } from 'api/api';
import { GroupTagValidation } from 'researcher/project/groups/groups-validation';

export class GroupsActionBar {
  static inject = [Api];

  constructor(api) {
    this.api = api;
    this.isTagError = false;
    this.tagName = null;
  }

  activate(model) {
    this.model = model;
  }

  async addGroupTag() {
    if (!GroupTagValidation
      .tagNameIsValid(this.tagName, this.model.react.props.tags)) {
      this.isTagError = true;
      return;
    }

    this.isTagError = false;
    this.model.react.addTag(this.tagName);
    this.tagName = null;
  }
}
