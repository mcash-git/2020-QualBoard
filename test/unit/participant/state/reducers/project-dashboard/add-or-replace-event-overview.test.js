import { addOrReplaceEventOverview } from 'participant/state/reducers/project-dashboard/add-or-replace-event-overview';
import { ParticipantProjectDashboardEventModel } from 'participant/project/dashboard/participant-project-dashboard-event-model';
import { updateEventOverview } from 'participant/state/actions/all';
import * as selectors from 'participant/state/selectors/get-current-user-state';

selectors.getCurrentUserState = jest.fn('participant/state/selectors/get-current-user-state');

selectors.getCurrentUserState.mockImplementation(() => ({ user: { timeZone: 'America/Chicago' } }));

describe('project-dashboard/addOrReplaceEventOverview()', () => {
  let state;
  let action;
  let resultState;
  let projectDashboard;
  
  describe('when participant has not loaded project dashboard', () => {
    it('does not change state', () => {
      state = {
        projectDashboard: {
          events: [],
          status: null,
        },
      };
      action = updateEventOverview({ projectId: 'asdf' });
      
      resultState = addOrReplaceEventOverview(state, action);
      
      expect(resultState).toBe(state);
    });
  });
  
  describe('when participant is on a different project\'s dashboard', () => {
    it('does not change state', () => {
      state = {
        projectDashboard: {
          projectId: 'asdf',
          events: [{}, {}],
        },
      };
      action = updateEventOverview({ projectId: 'fdsa' });
      
      resultState = addOrReplaceEventOverview(state, action);
      
      expect(resultState).toBe(state);
    });
  });
  
  describe('when participant is on the relevant project\'s dashboard', () => {
    let stateEvents;
    
    beforeEach(() => {
      stateEvents = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
      state = {
        projectDashboard: {
          projectId: '1',
          events: stateEvents,
        },
      };
    });
    
    describe('and Event with action.event.id is NOT in the collection', () => {
      it('pushes the event on the end of the collection - as ' +
        'ParticipantProjectDashboardEventModel', () => {
        const event = { id: 'd', projectId: '1' };
        action = updateEventOverview(event);
        
        resultState = addOrReplaceEventOverview(state, action);
        projectDashboard = resultState.projectDashboard;
        
        expect(projectDashboard.projectId).toBe('1');
        
        const events = projectDashboard.events;
        expect(events).toHaveLength(4);
        expect(events[3]).toBeDefined();
        
        const eventModel = events[3];
        expect(eventModel.constructor.name).toBe(ParticipantProjectDashboardEventModel.name);
        expect(eventModel.id).toBe(event.id);
      });
    });
    
    describe('and Event with action.event.id is in the collection', () => {
      it('replaces the existing event model with the new version passed in', () => {
        const event = { id: 'c', projectId: '1' };
        action = updateEventOverview(event);
        
        resultState = addOrReplaceEventOverview(state, action);
        projectDashboard = resultState.projectDashboard;
  
        expect(projectDashboard.projectId).toBe('1');
        
        const events = projectDashboard.events;
        expect(events).toHaveLength(3);
        
        const eventModel = events[2];
        expect(eventModel.constructor.name).toBe(ParticipantProjectDashboardEventModel.name);
        expect(eventModel.id).toBe(event.id);
      });
    });
  });
});
