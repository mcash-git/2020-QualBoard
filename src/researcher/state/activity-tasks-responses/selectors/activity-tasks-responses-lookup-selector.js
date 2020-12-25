import { createSelector } from 'reselect';
import flattenResponsesRecursive from 'shared/utility/task-responses/flatten-responses';
import activityTasksResponsesSelector from './activity-tasks-responses-selector';

const activityTasksResponsesLookupSelector = createSelector(
  activityTasksResponsesSelector,
  (responses) => responses && new Map(responses
    .reduce((accu, r) => accu.concat(flattenResponsesRecursive(r)), [])
    .map((r) => [r.id, r])),
);

export default activityTasksResponsesLookupSelector;
