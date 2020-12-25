import { bindingMode, computedFrom, bindable } from 'aurelia-framework';
import * as moment from 'moment-timezone';
import * as animate from 'amator';
import { AssetTypes } from '2020-media';
import { DialogService } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { VideoInsightBag } from 'researcher/models/video-insight-bag';
import { MediaDescriptorModel } from 'shared/media/media-descriptor-model';
import {
  VideoAssetInsightReadModel,
  VideoAssetInsightWriteModel,
} from 'researcher/models/video-asset-insight-model';
import { AnnotationsClient } from '2020-annotations';
import { VideoPlayer } from 'shared/media/video-player';
import { DomainState } from 'shared/app-state/domain-state';
import { CurrentUser } from 'shared/current-user';
import { videoInsightEvents } from 'shared/media/insights/video-insight-ea-events';

const highlightFadeClass = 'highlight-fade';
const highlightClass = 'highlight';

export class VideoInsightsPanel {
  static inject = [
    Element,
    EventAggregator,
    DialogService,
    DomainState,
    CurrentUser,
    AnnotationsClient,
  ];

  static eventSuffix:string = 'video-insights-panel';

  constructor(
    element:Element,
    ea:EventAggregator,
    dialogService:DialogService,
    domainState:DomainState,
    currentUser:CurrentUser,
    annotationsClient:AnnotationsClient,
  ) {
    this.element = element;
    this.ea = ea;
    this.dialogService = dialogService;
    this.domainState = domainState;
    this.currentUser = currentUser;
    this.annotationsClient = annotationsClient;

    this.editingInsight = null;
    this.onSaved = null;
    element.className = 'media-insights-panel';
  }

  element:Element;
  ea:EventAggregator;
  dialogService:DialogService;
  domainState:DomainState;
  currentUser:CurrentUser;
  annotationsClient:AnnotationsClient;
  scrollElement:Element;
  subscriptions:any[];
  timeoutLookupByElement:Map<Element,any>;
  onSaved:(() => void);

  @bindable({ defaultBindingMode: bindingMode.twoWay }) isOpen:boolean;
  @bindable mediaItem:MediaDescriptorModel;
  @bindable videoPlayer:VideoPlayer;
  @bindable projectId:string;

  private editingInsight:VideoInsightBag;

  bind() : void {
    this.timeoutLookupByElement = new Map<Element,any>();
    this.setSubscriptions();
  }

  unbind() : void {
    this.subscriptions.forEach(sub => sub.dispose());
  }

  private setSubscriptions() : void {
    this.subscriptions = [
      this.ea.subscribe(videoInsightEvents.cancelEdit, () => {
        this.editingInsight = null;
      }),
      this.ea.subscribe(videoInsightEvents.edit,
        (payload:any) => this.editingInsight = payload.insight),
      // this.ea.subscribe(events.endHighlightAnimation,
      //   (payload:any) =>
      //     this.endHighlightAnimation(this.insightBookmarkElements[payload.index])),
      this.ea.subscribe(videoInsightEvents.deleted,
        (payload:any) => this.handleRemove(payload.insight)),
      // this.ea.subscribe(events.highlightByResponseId,
      //   (payload:any) => this.highlightFadeByResponseId(payload.responseId)),
      this.ea.subscribe(videoInsightEvents.updated, (payload:any) => this.handleUpdated()),
      this.ea.subscribe(videoInsightEvents.scrollToTop,
        (payload:any) => animate(this.scrollElement, { scrollTop: 0 }, {})),
      this.ea.subscribe(videoInsightEvents.tryAdd, (payload:any) => this.tryAdd()),
      this.ea.subscribe(videoInsightEvents.tryEdit,
        (payload:any) => this.tryEdit(payload.insight)),
      this.ea.subscribe(videoInsightEvents.tryRemove,
        (payload:any) => this.tryDeleteRemove(payload.insight, payload.eventOrigin)),
    ];
  }

  open() : void {
    if (this.isOpen) {
      return;
    }

    this.isOpen = true;
    this.element.classList.add('active');
    this.videoPlayer.showInsights();
  }

  close() : void {
    if (!this.isOpen) {
      return;
    }
    this.isOpen = false;
    this.element.classList.remove('active');
    this.videoPlayer.hideInsights();
  }

  toggleOpen() : void {
    // TODO: probably replace with "tryClose" to make sure we do dirty check, etc.
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  async tryAdd() : Promise<VideoInsightBag> {
    if (this.editingInsight !== null) {
      await this.saveConfirmation(() => this.tryAdd());
      return;
    }

    this.editingInsight = new VideoInsightBag({
      isNew: true,
      isEditing: true,
      assetId: this.mediaItem.assetId,
      writeModel: new VideoAssetInsightWriteModel({
        projectId: this.projectId,
        assetId: this.mediaItem.assetId,
        fileName: this.mediaItem.fileName,
        start: null,
        end: null,
        id: null,
        targetId: null,
        comments: [],
        projectUser: this.domainState.currentProjectUser,
        createdOn: moment.tz(this.currentUser.timeZone),
      }),
      readModel: null,
      isLooping: false,
    });

    // find insertion point somehow.
    this.insertInsightSorted(this.editingInsight);
    this.videoPlayer.addInsight(this.editingInsight);
    this.ea.publish(videoInsightEvents.insightAdded, { insightBag: this.editingInsight });
  }

  private async tryEdit(insight:VideoInsightBag) : Promise<void> {
    if (this.editingInsight !== null) {
      await this.saveConfirmation(() => this.tryEdit(insight));
      return;
    }

    this.editingInsight = insight;
    this.ea.publish(`${videoInsightEvents.edit}:${insight.eventAggregatorSuffix}`);
  }

  async tryDeleteRemove(insight:VideoInsightBag, eventOrigin:any) : Promise<void> {
    if (insight.isNew) {
      // unsaved insight being cancelled
      this.handleRemove(insight);
      this.ea.publish(`${videoInsightEvents.delete}:${insight.eventAggregatorSuffix}`, {
        eventOrigin,
      });
      return;
    }

    this.dialogService.open({
      viewModel: 'shared/components/confirmation-modal',
      model: {
        title: 'Delete: Are you sure?',
        text: 'Are you sure you want to remove this insight bookmark?  Once deleted, it ' +
        'cannot be restored',
        confirmButtonText: 'Delete',
        confirmButtonClass: 'btn-danger',
        cancelButtonText: 'Cancel',
        cancelButtonClass: 'btn-outline-secondary',
      },
    }).whenClosed(async result => {
      if (result.wasCancelled) {
        return;
      }

      // hit the API to remove it
      this.ea.publish(`${videoInsightEvents.delete}:${insight.eventAggregatorSuffix}`, {
        eventOrigin,
      });
    });
  }

  handleScrollToInsight(event:CustomEvent) : void {
    this.scrollToInsight(event.detail.element);
  }

  handleUpdated() : void {
    this.editingInsight = null;
    this.mediaItem.sortInsights();
    if (this.onSaved !== null) {
      this.onSaved();
      this.onSaved = null;
    }
  }

  scrollToInsight(element:Element) : void{
    const doScroll = () => {

      const rect = element.getBoundingClientRect();
      const scrollDiff = rect.top - 45;
      const scrollTop = this.scrollElement.scrollTop + scrollDiff;

      animate(this.scrollElement, { scrollTop }, {});
    };

    if (!this.isOpen) {
      this.open();
      setTimeout(doScroll, 200);
    } else {
      doScroll();
    }
  }

  highlightFadeByInsightReferences(insights:VideoInsightBag[]) {
    this.highlightFadeByElements(
      insights.map((insight, index) =>
        this.insightBookmarkElements[this.mediaItem.insightBags.indexOf(insight)]));
  }

  highlightFadeByResponseId(responseId:string) {
    const elements = this.mediaItem.insightBags
      .map((insight, index) => insight.response.id === responseId ? index : null)
      .filter(index => index !== null)
      .map(index => this.insightBookmarkElements[index]);
    this.highlightFadeByElements(elements);
  }

  highlightFadeByElements(elements:Element[]) {
    const firstElement = Array.prototype.find.call(elements[0].parentElement.children, element =>
      Array.prototype.indexOf.call(elements, element) !== -1
    );

    this.scrollToInsight(firstElement);
    Array.prototype.forEach.call(elements, element => {
      const timeoutId = this.timeoutLookupByElement.get(element);
      if (timeoutId) {
        clearTimeout(timeoutId);
        this.timeoutLookupByElement.delete(element);
        element.classList.remove(highlightFadeClass);
      }

      setImmediate(() => {
        element.classList.add(highlightFadeClass);

        this.timeoutLookupByElement.set(element, setTimeout(() => {
          this.endHighlightAnimation(element);
        }, 5000));
      });
    });
  }

  private async saveConfirmation(onSaved:(() => void)) : Promise<void> {
    const confirmResult = await this.confirm();
    if (confirmResult.wasCancelled) {
      return;
    }

    this.onSaved = onSaved;
    this.ea.publish(`${videoInsightEvents.save}:${this.editingInsight.eventAggregatorSuffix}`);
    this.editingInsight = null;
  }

  private endHighlightAnimation(element:Element) : void {
    const timeoutId = this.timeoutLookupByElement.get(element);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeoutLookupByElement.delete(element);
    }
    element.classList.remove(highlightFadeClass);
  }

  private async confirm() : Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const text = `${this.editingInsight.readModel === null ?
          'You have created an insight bookmark that has not been saved.' :
          'You have some unsaved changes to the insight bookmark you are editing.'
          } Would you like to save it now?`;
        this.dialogService.open({
          viewModel: 'shared/components/confirmation-modal',
          model: {
            title: 'Would you like to save?',
            text,
            confirmButtonText: 'Save Bookmark',
            confirmButtonClass: 'btn-warning',
            cancelButtonText: 'Cancel',
            cancelButtonClass: 'btn-outline-secondary',
            titleIconClass: 'icon-warning warn',
            titleClass: 'warn',
            textClass: 'warn',
          },
        }).whenClosed(modalResult => resolve(modalResult));
      } catch (error) {
        return reject(error);
      }
    });
  }

  private handleRemove(insight:VideoInsightBag) : void {
    const index = this.mediaItem.insightBags.indexOf(insight);

    // NOTE: This is not the most elegant solution.  It will work, however, and other solutions
    // currently don't make sense to pursue, in terms of coordinating with removing the insight
    // from the media item AND from the collection on the entries view.
    if (index !== -1) {
      this.mediaItem.insightBags.splice(index, 1);
    }

    if (this.editingInsight === insight && insight.isNew) {
      this.editingInsight = null;
    }
  }

  insertInsightSorted(insight) {
    this.mediaItem.insertInsightSorted(insight);
  }

  insightHoverStart(insight) {
    this.videoPlayer.applyClassToInsight(insight, highlightClass);
  }

  insightHoverEnd(insight) {
    this.videoPlayer.removeClassFromInsight(insight, highlightClass);
  }

  private get insightBookmarkElements() : Element[] {
    return Array.from(this.element.querySelectorAll('.insight-bookmark'));
  }

  @computedFrom('isOpen')
  get toggleOpenIconClass() {
    return this.isOpen ? 'icon-ion-chevron-right' : 'icon-lightbulb_outline';
  }

  @computedFrom('mediaItem.insightBags.length')
  get shouldShowDefaultMessage() {
    return this.mediaItem.insightBags.length === 0;
  }
}
