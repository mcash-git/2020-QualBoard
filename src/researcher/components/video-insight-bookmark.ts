import { bindable, computedFrom } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import * as get from 'lodash.get';
import { ViewModes } from 'shared/enums/view-modes';
import { AnnotationsClient, Annotation } from '2020-annotations';
import { videoInsightEvents } from 'shared/media/insights/video-insight-ea-events';
import { VideoInsightBag } from 'researcher/models/video-insight-bag';
import { VideoPlayer } from 'shared/media/video-player';
import { growlProvider } from 'shared/growl-provider';

export class VideoInsightBookmark {
  static inject = [Element, AnnotationsClient, EventAggregator];

  constructor(
    element:Element,
    annotationsClient:AnnotationsClient,
    ea:EventAggregator,
  ) {
    this.element = element;
    this.annotationsClient = annotationsClient;
    this.ea = ea;
  }

  @bindable public insightBag:VideoInsightBag;
  @bindable public videoPlayer:VideoPlayer;
  @bindable public canEdit:boolean;

  private element:Element;
  private annotationsClient:AnnotationsClient;
  private ea:EventAggregator;
  private subscriptions:any[];

  activate({ insightBag = null, canEdit = true } = {}) {
    this.insightBag = insightBag;
    this.canEdit = canEdit;
    this.bind();
  }

  bind() : void {
    this.detectNewAndSetWriteMode();
    this.setSubscriptions();
  }

  unbind() : void {
    this.disposeSubscriptions();
  }

  setSubscriptions() : void {
    this.subscriptions = [
      this.ea.subscribe(`${videoInsightEvents.save}:${
        this.insightBag.eventAggregatorSuffix}`, payload => this.handleSave()),
      this.ea.subscribe(`${videoInsightEvents.edit}:${
        this.insightBag.eventAggregatorSuffix}`, payload => this.handleEdit()),
      this.ea.subscribe(`${videoInsightEvents.delete}:${
        this.insightBag.eventAggregatorSuffix}`, payload => {
        if (payload.eventOrigin === this) {
          this.handleDelete();
        }
      }),
      this.ea.subscribe(`${videoInsightEvents.updated}:${
        this.insightBag.eventAggregatorSuffix}`, payload => this.handleUpdated()),
    ];
  }

  disposeSubscriptions() : void {
    this.subscriptions.forEach(s => s.dispose());
  }

  handleTryEdit() : void {
    this.ea.publish(videoInsightEvents.tryEdit, { insight: this.insightBag });
  }

  handleEdit() : void {
    if (!this.canEdit) {
      return;
    }
    this.insightBag.writeModel = this.insightBag.readModel.toWriteModel();
    this.insightBag.isEditing = true;
    this.videoPlayer.editInsight(this.insightBag);
    this.ea.publish(videoInsightEvents.edit, { insight: this.insightBag });
  }

  async handleSave() : Promise<void>{
    const annotation = this.insightBag.writeModel.toAnnotation();
    if (this.insightBag.isNew) {
      annotation.id = await this.annotationsClient.createAnnotation(annotation);
      growlProvider.success('Success', 'The insight has been created.');
    } else {
      await this.update(annotation);
    }

    this.ea.publish(videoInsightEvents.saved, {
      id: annotation.id,
      assetId: this.insightBag.assetId,
    });
  }

  handleUpdated() : void {
    if (this.canEdit) {
      this.videoPlayer.finishEditingInsight();
    }
    this.insightBag.isEditing = false;
    if (this.insightBag.isNew) {
      this.insightBag.isNew = false;

      // we were subscribing to "insights:etc:NEW" and need to change to "insights:etc:{ID}"
      this.disposeSubscriptions();
      this.setSubscriptions();
    }
  }

  handleCancel() : void {
    if (this.insightBag.isNew) {
      this.handleTryRemove();
      return;
    }

    this.ea.publish(videoInsightEvents.cancelEdit);
    this.insightBag.isEditing = false;
    this.videoPlayer.finishEditingInsight();
  }


  handleTryRemove() : void {
    this.ea.publish(videoInsightEvents.tryRemove, {
      insight: this.insightBag,
      eventOrigin: this,
    });
  }

  async handleDelete() : Promise<void> {
    if (!this.insightBag.isNew) {
      await this.annotationsClient.deleteAnnotation(this.insightBag.readModel.id);
    }

    if (this.videoPlayer) {
      this.videoPlayer.removeInsight(this.insightBag);
    }

    this.ea.publish(videoInsightEvents.deleted, { insight: this.insightBag });
  }

  handleTogglePlay() : void {
    if (!this.videoPlayer) {
      return;
    }
    this.videoPlayer.toggleLoopInsight(this.insightBag);
  }

  private async update(annotation: Annotation) : Promise<void> {
    // right now we only support one insight-comment / annotation body.
    const comment = this.insightBag.writeModel.comments[0];
    const body = annotation.bodies.get()[0];

    if (comment && comment.id) {
      if (!comment.text || !comment.text.trim()) {
        //delete body
        const bodyId = this.insightBag.readModel.comments[0].id;
        await this.annotationsClient.deleteBody(annotation.id, bodyId);
      } else {
        // update body
        await this.annotationsClient.updateBody(annotation.id, body);
      }
    } else {
      // add body
      await this.annotationsClient.createBody(annotation.id, body);
    }

    const target = annotation.targets.get()[0];
    if (this.insightBag.writeModel.start !== this.insightBag.readModel.start ||
      this.insightBag.writeModel.end !== this.insightBag.readModel.end) {
      await this.annotationsClient.updateTarget(annotation.id, target);
    }

    growlProvider.success('Success', 'The insight has been updated.');
  }

  private detectNewAndSetWriteMode() : void {
    if (this.insightBag.isNew) {
      this.insightBag.isEditing = true;
    }
  }

  @computedFrom('videoPlayer.loopingInsight')
  get isLooping() : boolean {
    return get(this, 'videoPlayer.loopingInsight') === this.insightBag;
  }
}
