import receiveAnnotation from './annotations/logic/receive-annotation';
import removeAnnotation from './annotations/logic/remove-annotation';
import fetchAnnotations from './annotations/logic/fetch-annotations';
import fetchGroupTags from './group-tags/logic/fetch-group-tags';
import fetchParticipantMedia from './participant-media/logic/fetch-participant-media';
import toggleSelectAsset from './participant-media/logic/toggle-select-asset';
import fetchProjectUsers from './project-users/logic/fetch-project-users';
import toggleAssetType from './participant-media-applied-filters/logic/toggle-asset-type';
import participantMediaAppliedFiltersChanged from './participant-media-applied-filters/logic/participant-media-applied-filters-changed';
import fetchIndividualActivitiesForMediaFilters from './participant-media-applied-filters/logic/fetch-individual-activities-for-media-filters';
import fetchAllAssetIds from './participant-media/logic/fetch-all-asset-ids';
import fetchTasks from './activity-tasks/logic/fetch-tasks';
import fetchTaskResponses from './activity-tasks-responses/logic/fetch-task-responses';
import toggleExpandParticipantMediaFilter from './participant-media-applied-filters/logic/toggle-expand';
import selectTask from './activity-tasks/logic/select-task';
import tryAddResponse from './write-task-response-responses/logic/try-add-response';
import submitTaskResponse from './write-task-response-responses/logic/submit-response';
import removeWriteResponse from './write-task-response-responses/logic/remove-write-response';

export default [
  receiveAnnotation,
  removeAnnotation,
  fetchAnnotations,
  fetchAllAssetIds,
  fetchGroupTags,
  fetchParticipantMedia,
  fetchTasks,
  fetchTaskResponses,
  toggleSelectAsset,
  fetchProjectUsers,
  participantMediaAppliedFiltersChanged,
  toggleAssetType,
  fetchIndividualActivitiesForMediaFilters,
  selectTask,
  toggleExpandParticipantMediaFilter,
  tryAddResponse,
  submitTaskResponse,
  removeWriteResponse,
];
