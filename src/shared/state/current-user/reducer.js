import { handleActions } from 'redux-actions';

export default handleActions({
  CURRENT_USER: {
    SET: (state, action) => action.payload,
  },
}, null);
