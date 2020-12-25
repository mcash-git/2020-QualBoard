import { createActions } from 'redux-actions';

import ACCOUNT from './account/actions';
import ACTIVITY_TASKS from './activity-tasks/actions';
import ACTIVITY_TASKS_RESPONSES from './activity-tasks-responses/actions';
import ANNOTATIONS from './annotations/actions';
import GROUP_TAGS from './group-tags/actions';
import INDIVIDUAL_ACTIVITY from './individual-activity/actions';
import JOBS from './jobs/actions';
import PARTICIPANT_MEDIA_APPLIED_FILTERS from './participant-media-applied-filters/actions';
import PARTICIPANT_MEDIA from './participant-media/actions';
import PROJECT from './project/actions';
import PROJECT_USERS from './project-users/actions';
import WRITE_TASK_RESPONSE_RESPONSES from './write-task-response-responses/actions';

export const actions = createActions({
  ACCOUNT,
  ACTIVITY_TASKS,
  ACTIVITY_TASKS_RESPONSES,
  ANNOTATIONS,
  APP_CONFIG: {
    SET: undefined,
  },
  CURRENT_USER: {
    SET: undefined,
  },
  GROUP_TAGS,
  INDIVIDUAL_ACTIVITY,
  JOBS,
  PARTICIPANT_MEDIA,
  PARTICIPANT_MEDIA_APPLIED_FILTERS,
  PROJECT,
  PROJECT_USERS,
  WRITE_TASK_RESPONSE_RESPONSES,
});
