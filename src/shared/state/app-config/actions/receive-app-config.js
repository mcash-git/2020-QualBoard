import { createAction } from 'redux-actions';

export const RECEIVE_APP_CONFIG = 'RECEIVE_APP_CONFIG';

export const receiveAppConfig = createAction(RECEIVE_APP_CONFIG, (appConfig) => ({ appConfig }));
