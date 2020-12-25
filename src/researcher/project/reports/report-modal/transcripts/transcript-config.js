import { computedFrom } from 'aurelia-framework';
import { Api } from 'api/api';
import { enums } from '2020-qb4';
import { TranscriptValidation } from './transcript-validation';

const fileTypes = enums.reportFileTypes;

export class TranscriptConfig {
  static inject = [Api, TranscriptValidation];

  constructor(api, transValidation) {
    this.api = api;
    this.transValidation = transValidation;
    const ftRegex = /(xlsx)|(pdf)/i;
    this.fileTypes = fileTypes.filter(ft => ftRegex.test(ft.value));

    this.hasFilters = true;
  }

  activate(model) {
    this.report = model.report;
    this.participants = model.participants;
    this.groupTags = model.groupTags;
    this.individualActivities = model.individualActivities;
    this.accountId = model.accountId;
    this.projectId = model.projectId;
    this.validator = model.validator;

    // set-rule validations
    this.validator = this.transValidation.registerRules(this.validator);
  }

  @computedFrom('report.events', 'individualActivities.length')
  get filterActivitiesModel() {
    return {
      title: 'Individual Activities',
      isExpanded: true,
      isReadonly: false,
      taskIds: this.report.events,
      individualActivities: this.individualActivities,
    };
  }
}
