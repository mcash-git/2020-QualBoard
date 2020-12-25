import { createSelector } from 'reselect';
import { VideoAssetInsightReadModel } from 'researcher/models/video-asset-insight-model';
import { VideoInsightBag } from 'researcher/models/video-insight-bag';
import currentUserSelector from 'shared/state/current-user/selectors/current-user-selector';
import { getAnnotationMetadata } from 'shared/utility/annotations/get-annotation-metadata';
import { annotationTypes } from 'shared/utility/annotations/annotation-types';
import projectUserLookupSelector from '../../project-users/selectors/project-user-lookup-selector';

export default createSelector(
  (state) => state.project.id,
  (state) => state.annotations,
  projectUserLookupSelector,
  currentUserSelector,
  (projectId, allAnnotationsState, projectUserLookup, currentUser) => {
    const annotationsState = allAnnotationsState[projectId];

    const annotations = annotationsState && annotationsState.annotations;

    return projectUserLookup && annotations && annotations
      .filter((a) => getAnnotationMetadata(a).type === annotationTypes.video)
      .map((a) => {
        const readModel = VideoAssetInsightReadModel
          .fromAnnotation(a, projectUserLookup, currentUser.timeZone);

        return new VideoInsightBag({
          readModel,
          assetId: readModel.assetId,
        });
      });
  },
);
