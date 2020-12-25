export const defaultAppConfigState = { media: null };
export const defaultCurrentUserState = { user: null };
export const defaultEntryState = { entryId: null, entry: null };
export const defaultIndividualActivityState = { iaId: null, individualActivity: null };
export const defaultProjectDashboardState = { projectId: null, events: [] };
export const defaultProjectUsersState = { projectId: null, users: [], lookupById: null };
export const defaultSseState = { subscribedChannels: [] };

export const defaultState = {
  appConfig: defaultAppConfigState,
  currentUser: defaultCurrentUserState,
  entry: defaultEntryState,
  individualActivity: defaultIndividualActivityState,
  projectDashboard: defaultProjectDashboardState,
  projectUsers: defaultProjectUsersState,
  sse: defaultSseState,
};
