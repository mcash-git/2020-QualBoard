import { DialogController } from 'aurelia-dialog';
import { computedFrom, observable } from 'aurelia-framework';
import { Api } from 'api/api';
import { ReportService } from 'researcher/project/reports/report-service';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Validator } from '2020-aurelia';
import { growlProvider } from 'shared/growl-provider';
import { CurrentUser } from 'shared/current-user';
import { CrosstabConfigModel } from './crosstabs/crosstab-config-model';
import { TranscriptsConfigModel } from './transcripts/transcript-config-model';

export class ReportModal {
  static inject = [DialogController, ReportService, Api, EventAggregator, CurrentUser];

  constructor(dialogController, reportService, api, ea, currentUser) {
    this.modalService = dialogController;
    this.api = api;
    this.reportService = reportService;
    this.ea = ea;
    this.currentUser = currentUser;

    this.projectUsers = [];
    this.projectGroupTags = [];
  }

  @observable report;

  async canActivate(model) {
    this.accountId = model.accountId;
    this.projectId = model.projectId;

    this.report = {
      projectId: model.projectId,
      ...model.report,
      events: (model.report
        && model.report.events
        && model.report.events.reduce((acc, e) => [...acc, ...e.taskIds], []))
        || [],
    };

    this.isEditMode = Object.keys(this.report).length > 0 && this.report.constructor === Object;
    this.setUpSelectAndModel();
  }

  reportChanged() {
    this.validator = new Validator(this);
  }

  setSelectOptions() {
    switch (this.report.reportType) {
      case 0:
        // crosstabs
        this.reportTypeOptions = [
          CrosstabConfigModel.fromDto(this.report, this.currentUser),
        ];
        break;
      case 1:
        // transcripts
        this.reportTypeOptions = [
          TranscriptsConfigModel.fromDto(
            this.report,
            this.currentUser,
            this.projectUsers,
            this.projectGroupTags,
          ),
        ];
        break;
      default:
        this.reportTypeOptions = [
          CrosstabConfigModel.fromDto(this.report, this.currentUser),
          TranscriptsConfigModel.fromDto(
            this.report,
            this.currentUser,
            this.projectUsers,
            this.projectGroupTags,
          ),
        ];
    }
  }

  async setUpSelectAndModel() {
    const { groupTags, participants, individualActivities }
      = await this.api.query.projects.getParticipantFilters(this.projectId);

    this.projectUsers = participants;
    this.projectGroupTags = groupTags;
    this.individualActivities = individualActivities;

    this.setSelectOptions();
  }

  close() {
    growlProvider.removeValidationGrowls();
    this.modalService.close();
  }

  _validate() {
    const validationResult = this.validator.validate();

    if (validationResult.isValid) {
      return true;
    }

    const errors = [...new Set(validationResult.errors)];
    growlProvider.error('Unable to Save', errors.join('<br />'), { class: 'validation-error' });

    return false;
  }

  async createReport() {
    growlProvider.removeValidationGrowls();

    if (this._validate() === false) {
      return;
    }

    const events = [...this.report.events];
    // reformat checked individual activities to what the BE expects
    this.report.events = this.individualActivities.reduce((acc, ia) => {
      const taskIds = ia.tasks.filter(t => events.indexOf(t.id) !== -1).map(t => t.id);
      if (taskIds.length) {
        acc.push({ eventId: ia.id, eventType: 0, taskIds });
      }
      return acc;
    }, []);

    // pass the model itself
    await this.reportService.createReport(this.report);

    setTimeout(() => {
      this.ea.publish('fetch-reports');
    }, 200);
    this.close();
  }

  @computedFrom('report', 'projectUsers', 'individualActivities', 'projectGroupTags', 'projectId', 'accountId', 'validator')
  get subViewModel() {
    return {
      report: this.report,
      participants: this.projectUsers,
      individualActivities: this.individualActivities,
      groupTags: this.projectGroupTags,
      projectId: this.projectId,
      accountId: this.accountId,
      validator: this.validator,
    };
  }
}
