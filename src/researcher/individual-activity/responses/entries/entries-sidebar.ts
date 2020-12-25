import { ActivityEntries } from './activity-entries';
import * as animate from 'amator';
import * as moment from 'moment-timezone';
import * as get from 'lodash.get';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DialogService } from 'aurelia-dialog';
import { computedFrom } from 'aurelia-framework';
import { ParticipantTaskResponseModel } from 'participant/models/participant-task-response-model';
import { events } from './insight-ea-events';
import { videoInsightEvents } from 'shared/media/insights/video-insight-ea-events';
import { InsightBagBase } from 'researcher/models/insight-bag-base';
import { TaskResponseInsightBag } from 'researcher/models/task-response-insight-bag';
import { TaskResponseInsightWriteModel } from 'researcher/models/task-response-insight-model';
import { VideoInsightBag } from 'researcher/models/video-insight-bag';

const highlightFadeClass = 'highlight-fade';

export class EntriesSidebar {
  static inject = [Element, EventAggregator, DialogService];

  constructor(element:Element, ea:EventAggregator, dialogService:DialogService) {
    this.element = element;
    this.ea = ea;
    this.dialogService = dialogService;
    this.editingInsight = null;
    this.onSaved = null;

    this.element.classList.add('annotations-panel');
  }

  public element:Element;
  public scrollElement:Element;
  public ea:EventAggregator;
  public model:ActivityEntries;
  public dialogService:DialogService;

  private onSaved:(() => void);
  private editingInsight:InsightBagBase;
  private subscriptions:any[];
  private timeoutLookupByElement:Map<Element,any>;

  public activate(model:ActivityEntries) : void {
    this.model = model;

    this.timeoutLookupByElement = new Map<Element,any>();
    this.setSubscriptions();
  }

  public detached() : void {
    this.subscriptions.forEach(sub => sub.dispose());
  }

  private setSubscriptions() : void {
    this.subscriptions = [
      this.ea.subscribe(events.cancelEdit,
        () => { this.editingInsight = null; }),
      this.ea.subscribe(events.edit,
        (payload: any) => this.editingInsight = payload.insight),
      this.ea.subscribe(events.endHighlightAnimation,
        (payload: any) =>
          this.endHighlightAnimation(this.insightBookmarkElements[payload.index])),
      this.ea.subscribe(events.deleted,
        (payload: any) => this.handleRemove(payload.insight)),
      this.ea.subscribe(videoInsightEvents.deleted,
        (payload: any) => this.handleRemoveAssetInsight(payload.insight)),
      this.ea.subscribe(events.highlightByResponseId,
        (payload: any) => this.highlightFadeByResponseId(payload.responseId)),
      this.ea.subscribe(events.updated,
        (payload: any) => this.handleUpdated()),
      this.ea.subscribe(events.scrollToTop,
        (payload: any) => animate(this.scrollElement, { scrollTop: 0 }, {})),
      this.ea.subscribe(events.tryAdd,
        (payload: any) => this.tryAdd(payload.response)),
      this.ea.subscribe(events.tryEdit,
        (payload: any) => this.tryEdit(payload.insight)),
      this.ea.subscribe(events.tryRemove,
        (payload: any) => this.tryDeleteRemove(payload.insight)),
    ];
  }

  private async tryAdd(response:ParticipantTaskResponseModel) : Promise<void> {
    if (this.editingInsight !== null) {
      await this.saveConfirmation(() => this.tryAdd(response));
      return;
    }

    this.editingInsight = new TaskResponseInsightBag({
      writeModel: new TaskResponseInsightWriteModel({
        projectId: this.model.projectId,
        response,
        id: null,
        targetId: null,
        comments: [],
        projectUser: this.model.domainState.currentProjectUser,
        createdOn: moment.tz(this.model.currentUser.timeZone),
      }),
      readModel: null,
      response,
      isNew: true,
    });

    // find insertion point somehow.
    this.model.insertInsightSorted(this.editingInsight);
    this.ea.publish(events.scrollToResponse, { responseId: response.id });
  }

  private async tryEdit(insight:InsightBagBase) : Promise<void> {
    if (this.editingInsight !== null) {
      await this.saveConfirmation(() => this.tryEdit(insight));
      return;
    }

    this.editingInsight = insight;
    this.ea.publish(`${events.edit}:${insight.eventAggregatorSuffix}`);
  }

  async tryDeleteRemove(insight:InsightBagBase) : Promise<void> {
    if (insight.isNew) {
      // unsaved insight being cancelled
      this.handleRemove(insight);
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
      this.ea.publish(`${events.delete}:${insight.eventAggregatorSuffix}`);
    });
  }

  handleScrollToInsight(event:CustomEvent) : void {
    this.scrollToInsight(event.detail.element);
  }

  handleUpdated() : void {
    this.editingInsight = null;
    if (this.onSaved !== null) {
      this.onSaved();
      this.onSaved = null;
    }
  }

  scrollToInsight(element:Element) : void{
    const rect = element.getBoundingClientRect();
    const scrollDiff = rect.top - 80;
    const scrollTop = this.scrollElement.scrollTop + scrollDiff;

    animate(this.scrollElement, { scrollTop }, {});
  }

  highlightFadeByInsightReferences(insights:InsightBagBase[]) {
    this.highlightFadeByElements(
      insights.map((insight, index) =>
        this.insightBookmarkElements[this.model.insightBags.indexOf(insight)]));
  }

  highlightFadeByResponseId(responseId:string) {
    const elements = this.model.insightBags
      .map((insight, index) => get(insight, 'response.id') === responseId ? index : null)
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
    this.ea.publish(`${events.save}:${this.editingInsight.eventAggregatorSuffix}`);
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
            title: 'Whoops!',
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

  private handleRemove(insight:InsightBagBase) : void {
    this.removeInsight(insight);
  }

  private handleRemoveAssetInsight(insight:VideoInsightBag) : void {
    this.removeInsight(insight);

    const mediaItem = this.model.mediaItemLookupByAssetId.get(insight.assetId);

    const index = mediaItem.insightBags.indexOf(insight);

    if (index !== -1) {
      mediaItem.insightBags.splice(index, 1);
    }
  }

  private removeInsight(insight:InsightBagBase) : void {
    const index = this.model.insightBags.indexOf(insight);

    if (index !== -1) {
      this.model.insightBags.splice(index, 1);
    }

    if (this.editingInsight === insight && this.editingInsight.isNew) {
      this.editingInsight = null;
    }
  }

  private get insightBookmarkElements() : Element[] {
    return Array.from(this.element.querySelectorAll('.insight-bookmark'));
  }

  @computedFrom('model.insightBags.length')
  get shouldShowDefaultMessage() {
    return this.model.insightBags.length === 0;
  }
}
