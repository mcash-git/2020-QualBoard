import { createStore } from 'redux';
import { appConfigReducer } from './reducers/app-config/app-config-reducer';
import { currentUserReducer } from './reducers/current-user/current-user-reducer';
import { projectReducer } from './reducers/project/project-reducer';
import { projectDashboardReducer } from './reducers/project-dashboard/project-dashboard-reducer';
import { projectUsersReducer } from './reducers/project-users/project-users-reducer';
import { individualActivityReducer } from './reducers/individual-activity/individual-activity-reducer';
import { entryReducer } from './reducers/entry/entry-reducer';
import { sseReducer } from './reducers/sse/sse-reducer';
import { defaultState } from './default-state';

const reduceReducers =
  reducers =>
    reducers.reduce((chain, current) => (state, action) => current(chain(state, action), action));

export const participantStore = createStore(reduceReducers([
  appConfigReducer,
  currentUserReducer,
  projectReducer,
  projectDashboardReducer,
  projectUsersReducer,
  individualActivityReducer,
  entryReducer,
  sseReducer,
]), defaultState);
