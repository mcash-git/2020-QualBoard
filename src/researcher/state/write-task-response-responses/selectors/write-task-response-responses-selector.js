import { createSelector } from 'reselect';
import activityTasksSelectedTaskSelector from '../../activity-tasks/selectors/activity-tasks-selected-task-selector';
import currentProjectUserSelector from '../../project-users/selectors/current-project-user-selector';
import projectUserLookupSelector from '../../project-users/selectors/project-user-lookup-selector';

const writeTaskResponseResponsesSelector = createSelector(
  activityTasksSelectedTaskSelector,
  currentProjectUserSelector,
  projectUserLookupSelector,
  (state) => state.writeTaskResponseResponses,
  (selectedTask, currentProjectUser, projectUserLookup, allWriteTaskResponseResponses) => {
    if (!selectedTask || !currentProjectUser || !allWriteTaskResponseResponses[selectedTask.id]) {
      return [];
    }

    return allWriteTaskResponseResponses[selectedTask.id].responses.map((r) => ({
      ...r,
      user: currentProjectUser,
      parentUser: projectUserLookup.get(r.parentUserId),
    }));
  },
);

export default writeTaskResponseResponsesSelector;
