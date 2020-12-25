import { handleActions } from 'redux-actions';

import addGroupTag from './reducers/add-group-tag';
import addGroupTags from './reducers/add-group-tags';
import removeGroupTag from './reducers/remove-group-tag';
import setGroupTags from './reducers/set-group-tags';
import setFetchStatus from '../misc/reducers/set-project-level-fetch-status';
import updateGroupTag from './reducers/update-group-tag';

export default handleActions({
  GROUP_TAGS: {
    ADD: addGroupTag,
    ADD_MULTIPLE: addGroupTags,
    REMOVE: removeGroupTag,
    SET: setGroupTags,
    SET_FETCH_STATUS: setFetchStatus,
    UPDATE: updateGroupTag,
  },
}, {});
