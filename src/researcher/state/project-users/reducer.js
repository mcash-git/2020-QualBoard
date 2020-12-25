import { handleActions } from 'redux-actions';

import addParticipantGroupTag from './reducers/add-participant-group-tag';
import addParticipantGroupTags from './reducers/add-participant-group-tags';
import removeParticipantGroupTag from './reducers/remove-participant-group-tag';
import removeGroupTagFromAll from './reducers/remove-group-tag-from-all';
import replaceParticipantGroupTags from './reducers/replace-participant-group-tags';
import setProjectUsers from './reducers/set-project-users';
import addProjectUser from './reducers/add-project-user';
import removeProjectUser from './reducers/remove-project-user';
import updateProjectUser from './reducers/update-project-user';
import setFetchStatus from '../misc/reducers/set-project-level-fetch-status';

export default handleActions({
  PROJECT_USERS: {
    ADD: addProjectUser,
    GROUP_TAGS: {
      ADD: addParticipantGroupTag,
      ADD_MULTIPLE: addParticipantGroupTags,
      REMOVE: removeParticipantGroupTag,
      REMOVE_FROM_ALL: removeGroupTagFromAll,
      REPLACE: replaceParticipantGroupTags,
    },
    REMOVE: removeProjectUser,
    SET: setProjectUsers,
    SET_FETCH_STATUS: setFetchStatus,
    UPDATE: updateProjectUser,
  },
}, {});
