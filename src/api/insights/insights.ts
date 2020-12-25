import { AnnotationsClient } from '2020-annotations';
import {
  VideoAssetInsightReadModel,
  VideoAssetInsightWriteModel,
} from 'researcher/models/video-asset-insight-model';
import { InsightReadModelBase, InsightWriteModelBase } from 'researcher/models/insight-model-base';

export class Insights {
  static inject = [AnnotationsClient];

  constructor(annotationsClient:AnnotationsClient) {
    this.annotations = annotationsClient;
  }

  annotations:AnnotationsClient;

  async saveVideoInsight(insightAfter:VideoAssetInsightWriteModel, insightBefore:VideoAssetInsightReadModel) : Promise<void> {
    if (!insightBefore && !insightAfter.id) {
      await this.createVideoInsight(insightAfter);
      return;
    }

    return this.updateVideoInsight(insightAfter, insightBefore);
  }

  async createVideoInsight(insight:VideoAssetInsightWriteModel) : Promise<void> {
    const annotation = insight.toAnnotation();
    await this.annotations.createAnnotation(annotation);
  }

  async updateVideoInsight(insightAfter:VideoAssetInsightWriteModel, insightBefore:VideoAssetInsightReadModel) : Promise<void> {
    this.updateComment(insightAfter, insightBefore);

    const annotation = insightAfter.toAnnotation();

    const target = annotation.targets.get()[0];
    if (insightAfter.start !== insightBefore.start || insightAfter.end !== insightBefore.end) {
      await this.annotations.updateTarget(annotation.id, target);
    }
  }

  async deleteInsight(id:string) : Promise<void> {
    return this.annotations.deleteAnnotation(id);
  }

  private async updateComment(insightAfter:InsightWriteModelBase, insightBefore:InsightReadModelBase) : Promise<void> {
    // right now we only support one insight-comment / annotation body.
    const commentAfter = insightAfter.comments[0];
    const commentBefore = insightBefore.comments[0];

    const annotation = insightAfter.toAnnotation();
    const body = annotation.bodies.get()[0];

    if (commentAfter && commentAfter.id) {
      if (!commentAfter.text || !commentAfter.text.trim()) {
        // delete body
        const bodyId = insightBefore.comments[0].id;
        await this.annotations.deleteBody(annotation.id, bodyId);
      } else if (commentAfter.text !== commentBefore.text) {
        // update body
        await this.annotations.updateBody(annotation.id, body);
      }
    } else {
      // add body
      await this.annotations.createBody(annotation.id, body);
    }
  }
}
