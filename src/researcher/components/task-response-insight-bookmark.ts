import { bindable, computedFrom } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ViewModes } from 'shared/enums/view-modes';
import { AnnotationsClient, Annotation } from '2020-annotations';
import { TaskResponseInsightBag } from 'researcher/models/task-response-insight-bag';
import { events } from '../individual-activity/responses/entries/insight-ea-events';

export class TaskResponseInsightBookmark {
  static inject = [Element, AnnotationsClient, EventAggregator];

  constructor(element:Element, annotationsClient:AnnotationsClient, ea:EventAggregator) {
    this.element = element;
    this.annotationsClient = annotationsClient;
    this.ea = ea;
  }

  @bindable public insightBag:TaskResponseInsightBag;
  @bindable public viewMode:string = ViewModes.read;

  private element:Element;
  private annotationsClient:AnnotationsClient;
  private viewModes:any = ViewModes;
  private ea:EventAggregator;
  private subscriptions:any[];

  activate({ insightBag = null } = {}) {
    this.insightBag = insightBag;
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
      this.ea.subscribe(`${events.save}:${this.insightBag.eventAggregatorSuffix}`,
        payload => this.handleSave()),
      this.ea.subscribe(`${events.edit}:${this.insightBag.eventAggregatorSuffix}`,
        payload => this.handleEdit()),
      this.ea.subscribe(`${events.delete}:${this.insightBag.eventAggregatorSuffix}`,
        payload => this.handleDelete()),
      this.ea.subscribe(`${events.updated}:${this.insightBag.eventAggregatorSuffix}`,
          payload => this.handleUpdated()),
    ];
  }

  disposeSubscriptions() : void {
    this.subscriptions.forEach(s => s.dispose());
  }

  handleTryEdit() : void {
    this.ea.publish(events.tryEdit, { insight: this.insightBag });
  }

  handleEdit() : void {
    this.insightBag.writeModel = this.insightBag.readModel.toWriteModel();
    this.viewMode = ViewModes.write;
    this.ea.publish(events.edit, { insight: this.insightBag });
  }

  async handleSave() : Promise<void>{
    const annotation = this.insightBag.writeModel.toAnnotation();
    if (this.insightBag.isNew) {
      annotation.id = await this.annotationsClient.createAnnotation(annotation);
    } else {
      await this.update(annotation);
    }

    this.ea.publish(events.saved, { id: annotation.id });
  }

  handleUpdated() : void {
    this.viewMode = ViewModes.read;
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
    } else {
      this.ea.publish(events.cancelEdit)
    }
    this.viewMode = ViewModes.read;
  }

  handleTryRemove() : void {
    this.ea.publish(events.tryRemove, { insight: this.insightBag });
  }

  async handleDelete() : Promise<void>{
    if (!this.insightBag.isNew) {
      await this.annotationsClient.deleteAnnotation(this.insightBag.readModel.id);
    }

    this.ea.publish(events.deleted, { insight: this.insightBag });
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
  }

  private async create(annotation:Annotation) : Promise<void> {
    await this.annotationsClient.createAnnotation(annotation);
  }

  private detectNewAndSetWriteMode() {
    if (this.insightBag.isNew) {
      this.viewMode = ViewModes.write;
    }
  }
}
