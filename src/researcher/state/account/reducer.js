import { handleActions } from 'redux-actions';

export default handleActions({
  ACCOUNT: {
    SET: (state, action) => action.payload,
  },
}, null);
