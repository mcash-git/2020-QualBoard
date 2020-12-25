import { createSelector } from 'reselect';
import moment from 'moment-timezone';
import currentUserSelector from 'shared/state/current-user/selectors/current-user-selector';
import { linkParentChildResponses } from 'shared/utility/link-parent-child-responses';
import createMapMediaItem from 'shared/utility/media/create-map-media-item';
import activityTasksSelectedTaskSelector from '../../activity-tasks/selectors/activity-tasks-selected-task-selector';
import projectUserLookupSelector from '../../project-users/selectors/project-user-lookup-selector';
import writeTaskResponseResponsesLookupSelector from '../../write-task-response-responses/selectors/write-task-response-responses-lookup-selector';

const activityTasksResponsesSelector = createSelector(
  (state) => state.appConfig,
  activityTasksSelectedTaskSelector,
  projectUserLookupSelector,
  currentUserSelector,
  writeTaskResponseResponsesLookupSelector,
  (state) => state.activityTasksResponses,
  (
    appConfig,
    selectedTask,
    projectUserLookup,
    currentUser,
    writeResponsesLookup, // looks up write responses by parentResponseId
    allActivityTasksResponsesState,
  ) => {
    if (!selectedTask) {
      return null;
    }

    const activityTasksResponsesState =
      allActivityTasksResponsesState && allActivityTasksResponsesState[selectedTask.id];

    const optionsLookup = new Map(selectedTask.options.map((o) => [o.optionId, o]));

    return activityTasksResponsesState &&
      linkParentChildResponses(activityTasksResponsesState.responses.map((r) => ({
        ...r,
        user: projectUserLookup.get(r.userId),
        respondedOn: moment.tz(r.responseTimeStamp, currentUser.timeZone),
        options: (r.responseOptions || []).map((optionId) => optionsLookup.get(optionId)),
        media: (r.media || []).map(createMapMediaItem(appConfig)),
        writeResponse: writeResponsesLookup.get(r.id),
      })));
  },
);

export default activityTasksResponsesSelector;
