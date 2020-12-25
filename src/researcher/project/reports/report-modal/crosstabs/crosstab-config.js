import { computedFrom } from 'aurelia-framework';
import { Api } from 'api/api';
import { enums } from '2020-qb4';
import { CrosstabValidation } from './crosstab-validation';

const fileTypes = enums.reportFileTypes;

export class CrosstabsConfig {
  static inject = [Api, CrosstabValidation];

  constructor(api, crosstabValidation) {
    this.api = api;
    this.crosstabValidation = crosstabValidation;
    const ftRegex = /(xlsx)/i;
    this.fileTypes = fileTypes.filter(ft => ftRegex.test(ft.value));

    this.hasFilters = false;
  }

  activate(model) {
    this.report = model.report;
    this.participants = model.participants;
    this.groupTags = model.groupTags;
    this.individualActivities = model.individualActivities;
    this.accountId = model.accountId;
    this.projectId = model.projectId;
    this.validator = model.validator;

    this.validator = this.crosstabValidation.registerRules(this.validator);
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
