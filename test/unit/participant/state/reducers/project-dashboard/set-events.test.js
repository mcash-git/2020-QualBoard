import { setEvents } from 'participant/state/reducers/project-dashboard/set-events';
import { receiveProjectDashboardEvents } from 'participant/state/actions/all';
import { ParticipantProjectDashboardEventModel } from 'participant/project/dashboard/participant-project-dashboard-event-model';
import * as selectors from 'participant/state/selectors/get-current-user-state';

selectors.getCurrentUserState = jest.fn('participant/state/selectors/get-current-user-state');

selectors.getCurrentUserState.mockImplementation(() => ({ user: { timeZone: 'America/Chicago' } }));

const projectId = 'some-project-id';
const events = [{ id: '1', projectId }];

describe('project-dashboard/setEvents()', () => {
  let state;
  let action;
  let resultState;
  let projectDashboard;
  
  beforeEach(() => {
    state = { projectDashboard: {} };
  });
  
  it('updates projectDashboard.projectId', () => {
    action = receiveProjectDashboardEvents(projectId, events);
    resultState = setEvents(state, action);
    projectDashboard = resultState.projectDashboard;
    
    expect(projectDashboard.projectId).toBe(projectId);
  });
  
  it('sets projectDashboard.events to a mapped collection of ' +
    'ParticipantProjectDashboardEventModels', () => {
    action = receiveProjectDashboardEvents(projectId, events);
    resultState = setEvents(state, action);
    projectDashboard = resultState.projectDashboard;
    
    expect(projectDashboard.events).toHaveLength(1);
    
    const event = projectDashboard.events[0];
    
    expect(event.constructor.name)
      .toBe(ParticipantProjectDashboardEventModel.name);
    expect(event.id).toBe(events[0].id);
  });
});
