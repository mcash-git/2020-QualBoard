import { regexFactory } from 'shared/utility/regex-factory';
import { annotationTypes } from './annotation-types';

export function getAnnotationMetadata(annotation) {
  const videoInsightIriRegex = regexFactory.getVideoInsightIriRegex();
  const taskResponseInsightIriRegex = regexFactory.getTaskResponseInsightIriRegex();
  const target = annotation.targets.get()[0];
  
  const videoMatch = videoInsightIriRegex.exec(target.iri);
  if (videoMatch) {
    const [, projectId, assetId] = videoMatch;
    return {
      type: annotationTypes.video,
      assetId,
      projectId,
    };
  }
  
  const taskResponseMatch = taskResponseInsightIriRegex.exec(target.iri);
  if (taskResponseMatch) {
    const [, projectId, responseId] = taskResponseMatch;
    return {
      type: annotationTypes.taskResponse,
      responseId,
      projectId,
    };
  }
  
  return {
    type: annotationTypes.unknown,
  };
}
