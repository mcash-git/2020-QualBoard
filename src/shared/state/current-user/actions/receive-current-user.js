import { createAction } from 'redux-actions';

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';

export const receiveCurrentUser = createAction(RECEIVE_CURRENT_USER, (user) => ({ user }));
