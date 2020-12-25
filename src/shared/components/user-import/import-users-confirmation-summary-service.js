import { computedFrom } from 'aurelia-framework';
import { enums } from '2020-aurelia-bulk-import';

const ImportOverwriteBehaviors = enums.importOverwriteBehaviors;

export class ImportUsersConfirmationSummaryService {
  constructor(bulkImportModel) {
    this.bulkImportModel = bulkImportModel;
    this.existingProjectUserLookup =
      bulkImportModel.existingProjectUserLookup;
    this.existingEventUserLookup = bulkImportModel.existingEventUserLookup ||
      {};
    this.importingUsers = this.bulkImportModel.output;
    this.newTags = bulkImportModel.importUsersModel.newTags;

    // TODO:  This.  Drop?
    this.newTagsTooltip = `New tags: [${
      this.newTags.map(tag => tag.name).join('], [')
    }]`;

    this.counts = this._getCounts();
  }

  _getCounts() {
    const counts = this.importingUsers.reduce((out, user) => {
      if (this.existingProjectUserLookup[user.email.toLowerCase()]) {
        out.existingProjectUserCount++;
      } else {
        out.newProjectUserCount++;
      }

      // when importing project users, the event counts are ignored.
      if (this.existingEventUserLookup[user.email.toLowerCase()]) {
        out.existingEventUserCount++;
      } else {
        out.newEventUserCount++;
      }
      return out;
    }, {
      newProjectUserCount: 0,
      existingProjectUserCount: 0,
      newEventUserCount: 0,
      existingEventUserCount: 0,
    });
    counts.newTagCount = this.newTags ? this.newTags.length : 0;

    return counts;
  }
  @computedFrom(
    'counts.existingProjectUserCount',
    'bulkImportModel.mergeStrategy',
  )
  get existingProjectUserText() {
    if (this.counts.existingProjectUserCount === 0) {
      return '(Your import does not include any existing users)';
    }

    if (this.bulkImportModel.mergeStrategy ===
      ImportOverwriteBehaviors.none.int) {
      return `(${this.counts.existingProjectUserCount} existing user${
        this.counts.existingProjectUserCount === 1 ? '' : 's'
      } will be ignored due to the chosen merge strategy above)`;
    }

    return this.counts.existingProjectUserCount;
  }

  get existingEventUserText() {
    return this.counts.existingEventUserCount === 0 ?
      '0' :
      `(${this.counts.existingEventUserCount} users are already in this event and will not receive another invitation)`;
  }

  get willImportNewUsers() {
    return this.counts.newProjectUserCount > 0;
  }
}
