import { handleActions } from 'redux-actions';

import addJob from './reducers/add-job';
import updateJob from './reducers/update-job';

export default handleActions({
  JOBS: {
    ADD: addJob,
    SET: (state, action) => action.payload,
    UPDATE: updateJob,
  },
}, null);
