import { handleActions } from 'redux-actions';

export default handleActions({
  PROJECT: {
    SET: (state, action) => action.payload,
  },
}, {});
