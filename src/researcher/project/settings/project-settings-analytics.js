import { computedFrom, bindable, bindingMode } from 'aurelia-framework';
import { Api } from 'api/api';
import { AnalyticsClient, ServiceTiers } from '2020-analytics';
import { DomainState } from 'shared/app-state/domain-state';

export class ProjectSettingsAnalytics {
  static inject = [Api, DomainState, AnalyticsClient];

  constructor(api, domainState, analyticsClient) {
    this.api = api;
    this.domainState = domainState;
    this.analyticsClient = analyticsClient;
    this.tiers = ServiceTiers.filter(tier => tier.value !== 'Free');
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) project;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) selectedTier;

  activate(model) {
    this.project = model.project;
  }

  projectChanged() {
    this._setEdit();
  }

  editClick() {
    this.project.editing = 'analytics';
  }

  saveClick() {
    this._save();
  }

  cancelClick() {
    this._setEdit();
    this.project.editing = undefined;
  }

  get currentTier() {
    return this.tiers.find(tier => tier.int === this.selectedTier);
  }

  // "private" methods

  _setEdit() {
    this.edit = {
      id: this.project.id,
    };
  }

  _save() {
    this.analyticsClient.updateAnalyticsProject(this.project.id, this.selectedTier).then(() => {
      this.project.editing = undefined;
    });
  }

  @computedFrom('project.editing')
  get isEditing() {
    return this.project.editing === 'analytics';
  }
}
