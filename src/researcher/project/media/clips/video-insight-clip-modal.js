import { DialogService } from 'aurelia-dialog';
import { Api } from 'api/api';
import { ViewState } from 'shared/app-state/view-state';
import { AppConfig } from 'app-config';
import { CurrentUser } from 'shared/current-user';
import videoInsightsSelector from 'researcher/state/annotations/selectors/video-insights-selector';
import { growlProvider } from 'shared/growl-provider';

export class VideoInsightClipModal {
  static inject = [ViewState, AppConfig, CurrentUser, DialogService, Api, 'store'];

  constructor(viewState, appConfig, currentUser, dialogService, api, store) {
    this.viewState = viewState;
    this.mediaApiBaseUrl = appConfig.media.baseUrl;
    this.currentUser = currentUser;
    this.dialogService = dialogService;
    this.api = api;
    this.store = store;

    this.confirm = (model) => new Promise((resolve) => {
      this.dialogService.open({
        viewModel: 'shared/components/confirmation-modal',
        model,
      }).whenClosed((result) => {
        resolve(!result.wasCancelled);
      });
    });

    this.saveInsight = async (insightBag) => {
      this.api.insights.updateVideoInsight(insightBag.writeModel, insightBag.readModel);
    };

    this.removeInsight = async (insightBag) => {
      this.api.insights.deleteInsight(insightBag.readModel.id);
    };
  }

  viewState;
  insight;
  currentUser;
  mediaApiBaseUrl;
  dialogService;
  api;
  store;
  closeModal;
  confirm;
  removeInsight;
  saveInsight;
  unsubscribeFromStore;
  shouldSquelchUpdateGrowl;

  activate({ insight } = {}) {
    this.closeModal = () => this.close();
    this.insight = insight;

    this.unsubscribeFromStore = this.store.subscribe(this.handleStateChange.bind(this));
  }

  doUpdateGrowl() {
    if (this.shouldSquelchUpdateGrowl) {
      return;
    }

    this.shouldSquelchUpdateGrowl = true;
    growlProvider.success('Updated', 'The clip has been updated.');
    setTimeout(() => { this.shouldSquelchUpdateGrowl = false; }, 2000);
  }

  detached() {
    this.unsubscribeFromStore();
  }

  close() {
    this.viewState.closeModal();
  }

  handleStateChange() {
    const state = this.store.getState();
    const insights = videoInsightsSelector(state);
    const insightFromStore = insights.find(i => i.readModel.id === this.insight.readModel.id);

    if (!insightFromStore) {
      growlProvider.info('Deleted', 'The clip you were viewing has been deleted.');
      this.close();
      return;
    }

    if (insightFromStore === this.insight) {
      return;
    }

    this.doUpdateGrowl();
    this.insight = insightFromStore;
  }
}
