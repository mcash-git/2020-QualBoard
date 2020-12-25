import { handleActions } from 'redux-actions';

export default handleActions({
  APP_CONFIG: {
    SET: (state, action) => action.payload,
  },
}, null);
