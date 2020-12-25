import { handleActions } from 'redux-actions';

export default handleActions({
  INDIVIDUAL_ACTIVITY: {
    SET: (state, action) => action.payload.individualActivity,
  },
}, {});
