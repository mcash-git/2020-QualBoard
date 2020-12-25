import { combineReducers } from 'redux';
import appConfig from 'shared/state/app-config/reducer';

import currentUser from 'shared/state/current-user/reducer';

import account from './account/reducer';
import activityTasks from './activity-tasks/reducer';
import activityTasksResponses from './activity-tasks-responses/reducer';
import annotations from './annotations/reducer';
import groupTags from './group-tags/reducer';
import individualActivity from './individual-activity/reducer';
import project from './project/reducer';
import jobs from './jobs/reducer';
import participantMedia from './participant-media/reducer';
import participantMediaAppliedFilters from './participant-media-applied-filters/reducer';
import projectUsers from './project-users/reducer';
import writeTaskResponseResponses from './write-task-response-responses/reducer';

export default combineReducers({
  account,
  activityTasks,
  activityTasksResponses,
  annotations,
  appConfig,
  currentUser,
  groupTags,
  individualActivity,
  jobs,
  participantMedia,
  participantMediaAppliedFilters,
  project,
  projectUsers,
  writeTaskResponseResponses,
});
