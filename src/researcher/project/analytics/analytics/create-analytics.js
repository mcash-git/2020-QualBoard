import { BindingEngine } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { AnalyticsClient } from '2020-analytics';
import { Validator, ValidationRule } from '2020-aurelia';
import { Api } from 'api/api';
import { safeSessionStorage } from 'shared/utility/safe-session-storage';
import { growlProvider } from 'shared/growl-provider';
import { ExtractionJobModel } from 'researcher/project/analytics/analytics/extraction-job-model';
import moment from 'moment';
import * as validate from 'validator';
import { AnalyticsSettingsModel } from './analytics-settings-model';

const genericStorageKeyBase = 'create-analytics';
const ignoreSettingsProperties = [
  'projectUserLogicRules',
  'availableGroupTags',
  'participants',
  'userIds',
];

export class CreateAnalytics {
  static inject = [Api, AnalyticsClient, BindingEngine, Router];

  constructor(api, analyticsClient, bindingEngine, router) {
    this.api = api;
    this.analyticsClient = analyticsClient;
    this.bindingEngine = bindingEngine;
    this.router = router;
  }

  numberOfConceptsChoices = [1, 2, 3, 4, 5, 6, 7, 8];
  numberOfKeywordsChoices = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  observeSubscriptions = [];

  async canActivate(params) {
    this.projectId = params.projectId;
    this.accountId = params.accountId;

    this.baseExploreUrl = `#${this.router.history.fragment}/explore`;

    this.clientStorageKeyBase = `${this.projectId}:${genericStorageKeyBase}`;
    this.clientStorageKeys = {
      settings: `${this.clientStorageKeyBase}:settings`,
    };

    const [{ groupTags, participants, individualActivities }] =
      await Promise.all([
        this.api.query.projects.getParticipantFilters(this.projectId),
        this._getFeatureExtractionJobs(),
      ]);

    // This is required for the logic engine project-user filters
    participants.forEach(p => { p.userId = p.id; });

    this.settingsModelBase = {
      availableGroupTags: groupTags,
      participants,
    };

    this._restoreSettingsModel();
    this._beginObservingSettingsModel();

    this.availableGroupTags = groupTags;
    this.participants = participants;
    this.individualActivities = individualActivities;

    this.notEnoughVerbatims = false;
  }

  deactivate() {
    this._clearObserveSubscriptions();
  }

  bind() {
    this._setUpValidation();
  }

  clear() {
    this.settingsModel =
      new AnalyticsSettingsModel(Object.assign({
        externalProjectId: this.projectId,
      }, this.settingsModelBase));
    this._validateAndStoreSettingsModel();
  }

  async createAnalysisClick() {
    if (!this._validate(true)) {
      return;
    }

    if (this.settingsModel.projectUserLogicRules.length > 0) {
      const result = await this.api.query.projectUsers
        .getUserIdsFromLogicEngineRules({
          projectId: this.projectId,
          rules: this.settingsModel.projectUserLogicRules.map(r => r.toDto()),
        });

      if (result.error) {
        // handle error
        growlProvider.error('Error', 'There was an error processing your filters.  Please try again.  If the problem persists, please contact support.');
        return;
      }

      this.settingsModel.userIds = result;
    }

    const settingsDto = this.settingsModel.toDto();

    this.filteredVerbatimCount = await this.analyticsClient
      .getFilteredVerbatimCount(settingsDto);

    if (this.filteredVerbatimCount.verbatimCount < 200) {
      this.shouldShowAlert = true;
      this.alertMessage = 'There is not quite enough data to create a concept. Please try again after you have more activity. Minimum requirement is 200 verbatims.';
      return;
    }

    // TODO:  Do something with the result response?
    await this.analyticsClient
      .createFeatureExtractionJob(settingsDto);

    this._getFeatureExtractionJobs();
  }

  handleLogicEngineRulesChange() {
    this._validateAndStoreSettingsModel();
  }

  async _getFeatureExtractionJobs() {
    this.jobs = (await this.analyticsClient.getFeatureExtractionJobs(this.projectId))
      .map(j => new ExtractionJobModel(j));
  }

  _setUpValidation() {
    const valueFormat = 'YYYY-MM-DD';

    const validator = new Validator(this);
    validator.registerRule(new ValidationRule({
      property: 'settingsModel.startAt',
      validate: value => moment(value, valueFormat).isValid(),
      message: 'Please specify a valid start date.',
      runIf: value => value,
    }));
    validator.registerRule(new ValidationRule({
      property: 'settingsModel.endAt',
      validate: value => moment(value, valueFormat).isValid(),
      runIf: value => value,
      message: 'Please specify a valid end date.',
    }));
    validator.registerRule(new ValidationRule({
      property: 'settingsModel.endAt',
      validate: (value, model) => validate
        .isAfter(value, model.settingsModel.startAt) ||
      !validate.isBefore(value, model.settingsModel.startAt),
      runIf: (value, model) => value && model.settingsModel.startAt &&
      moment(model.settingsModel.startAt, valueFormat).isValid(),
      message: 'Please specify a valid date range (start must come after end.)',
    }));
    validator.registerRule(new ValidationRule({
      property: 'settingsModel.name',
      validate: value => value,
      message: 'Please enter an Analysis Name.',
    }));
    this.validator = validator;
  }

  _validate(shouldShowNotificationOnFailure) {
    const validationResult = this.validator.validate();

    if (validationResult.isValid) {
      return true;
    } else if (!shouldShowNotificationOnFailure) {
      return false;
    }

    const errors = ['Please correct the following error(s):', ...validationResult.errors];
    growlProvider.warning('Unable to generate', errors.join('<br />', { timeout: false }));

    return false;
  }

  _restoreSettingsModel() {
    this._restoreOrCreateSettingsModel();
  }

  _validateAndStoreSettingsModel() {
    this._validate(false);
    safeSessionStorage
      .setObject(
        this.clientStorageKeys.settings,
        this.settingsModel.toSessionStorage(),
      );
  }

  _restoreOrCreateSettingsModel() {
    const fromStorage = safeSessionStorage
      .getObject(this.clientStorageKeys.settings);

    this.settingsModel = new AnalyticsSettingsModel(Object.assign(
      {},
      fromStorage || { externalProjectId: this.projectId },
      this.settingsModelBase,
    ));
  }

  _beginObservingSettingsModel() {
    Object.keys(this.settingsModel).forEach(prop => {
      if (ignoreSettingsProperties.indexOf(prop) !== -1) {
        return;
      }

      this.observeSubscriptions.push(Array.isArray(this.settingsModel[prop]) ?
        this.bindingEngine
          .collectionObserver(this.settingsModel[prop])
          .subscribe(() => this._validateAndStoreSettingsModel()) :
        this.bindingEngine
          .propertyObserver(this.settingsModel, prop)
          .subscribe(() => this._validateAndStoreSettingsModel()));
    });
  }

  _clearObserveSubscriptions() {
    this.observeSubscriptions.forEach(s => {
      s.dispose();
    });
    this.observeSubscriptions = [];
  }
}
