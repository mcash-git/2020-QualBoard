import { createSelector } from 'reselect';
import currentUserSelector from 'shared/state/current-user/selectors/current-user-selector';
import projectUserLookupSelector from 'researcher/state/project-users/selectors/project-user-lookup-selector';
import { PaginationPageModel } from 'shared/models/pagination-page-model';
import getAssetUrls from 'shared/utility/media/get-asset-urls';
import moment from 'moment-timezone';

const participantMediaCurrentPageSelector = createSelector(
  (state) => state.appConfig,
  (state) => state.project.id,
  (state) => state.participantMedia,
  currentUserSelector,
  projectUserLookupSelector,
  (appConfig, projectId, allParticipantMediaState, { timeZone }, projectUserLookup) => {
    const participantMediaState = allParticipantMediaState[projectId];
    return participantMediaState && participantMediaState.currentPage && new PaginationPageModel({
      ...participantMediaState.currentPage,
      items: participantMediaState.currentPage.items.map(asset => {
        const createdOn = moment.tz(asset.dateCreated, timeZone).format('M/D/YYYY');
        const createdBy = projectUserLookup.get(asset.ownerId);
        const { url, thumbnailUrl } =
          getAssetUrls(asset, appConfig.media.baseUrl, appConfig.media.imageUriBase);
        return {
          createdOn,
          createdBy: createdBy && createdBy.displayName,
          url,
          thumbnailUrl,
          id: asset.id,
          durationMs: asset.durationMilliseconds,
          name: asset.name,
          fileName: asset.fileName,
          type: asset.type,
          fileSize: asset.fileSize,
        };
      }),
    });
  },
);

export default participantMediaCurrentPageSelector;
