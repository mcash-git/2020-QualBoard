export const actionNames = {
  receiveAppConfig: 'RECEIVE_APP_CONFIG',
  receiveCurrentUser: 'RECEIVE_CURRENT_USER',
  receiveEntry: 'RECEIVE_ENTRY',
  receiveEntryStatusChange: 'RECEIVE_ENTRY_STATUS_CHANGE',
  receiveIndividualActivity: 'RECEIVE_INDIVIDUAL_ACTIVITY',
  receiveNextTask: 'RECEIVE_NEXT_TASK',
  receiveProjectDashboardEvents: 'RECEIVE_PROJECT_DASHBOARD_EVENTS',
  receiveProjectUsers: 'RECEIVE_PROJECT_USERS',
  receiveProject: 'RECEIVE_PROJECT',
  receiveTaskResponse: 'RECEIVE_TASK_RESPONSE',
  releaseEntry: 'RELEASE_ENTRY',
  updateEventOpenState: 'UPDATE_EVENT_OPEN_STATE',
  updateEventOverview: 'RECEIVE_EVENT_OVERVIEW',
};

export function receiveProjectDashboardEvents(projectId, events) {
  return {
    type: actionNames.receiveProjectDashboardEvents,
    payload: { projectId, events },
  };
}

export function updateEventOverview(event) {
  return {
    type: actionNames.updateEventOverview,
    payload: { projectId: event.projectId, event },
  };
}

export function updateEventOpenState(event, isOpen) {
  return {
    type: actionNames.updateEventOpenState,
    payload: { event, isOpen },
  };
}

export function receiveProjectUsers(projectId, users) {
  return {
    type: actionNames.receiveProjectUsers,
    payload: { projectId, users },
  };
}

export function receiveIndividualActivity(iaId, individualActivity) {
  return {
    type: actionNames.receiveIndividualActivity,
    payload: { iaId, individualActivity },
  };
}

export function receiveEntry(entryId, entry) {
  return {
    type: actionNames.receiveEntry,
    payload: { entryId, entry },
  };
}

export function receiveTaskResponse(response) {
  return {
    type: actionNames.receiveTaskResponse,
    payload: { response },
  };
}

export function receiveNextTask(nextTaskDetails) {
  return {
    type: actionNames.receiveNextTask,
    payload: { nextTaskDetails },
  };
}

export function releaseEntry() {
  return {
    type: actionNames.releaseEntry,
  };
}

export function receiveEntryStatusChange(entryDetails) {
  return {
    type: actionNames.receiveEntryStatusChange,
    payload: { entryDetails },
  };
}

export function receiveProject(project) {
  return {
    type: actionNames.receiveProject,
    payload: { project },
  };
}

export function receiveCurrentUser(user) {
  return {
    type: actionNames.receiveCurrentUser,
    payload: { user },
  };
}

export function receiveAppConfig(appConfig) {
  return {
    type: actionNames.receiveAppConfig,
    payload: { appConfig },
  };
}
