import moment from 'moment-timezone';
import { enums } from '2020-qb4';
import { updateEventOpenState }
  from 'participant/state/reducers/project-dashboard/update-event-open-state';
import { ParticipantProjectDashboardEventModel }
  from 'participant/project/dashboard/participant-project-dashboard-event-model';
import * as actions from 'participant/state/actions/all';

const projectId = '1';
const id = 'a';
const tomorrowId = 'tomorrow';
const timeZone = 'America/Chicago';
const EventTypes = enums.eventTypes;
const RepeatUnits = enums.repeatUnits;
const CompletionStatuses = enums.completionStatuses;

describe('project-dashboard/updateEventOpenState()', () => {
  describe('when participant has not loaded project dashboard', () => {
    it('does not change state', () => {
      const state = {
        projectDashboard: {
          projectId: null,
          events: [],
        },
      };
      
      const result = updateEventOpenState(state, actions.updateEventOpenState({
        id,
        projectId,
      }, true));
      
      expect(result).toBe(state);
    });
  });
  
  describe('when participant is on a different project\'s dashboard', () => {
    it('does not change state', () => {
      const state = {
        projectDashboard: {
          projectId: 'asdf',
          events: [{}, {}],
        },
      };
      
      const result = updateEventOpenState(state,
        actions.updateEventOpenState({ projectId, id }), true);
      
      expect(result).toBe(state);
    });
  });
  
  describe('when participant is on the relevant project\'s dashboard', () => {
    let state;
    let stateEvents;
    let event;
    let action;
    let resultState;
    let projectDashboard;
    
    beforeEach(() => {
      stateEvents = [
        getEventOpeningNow('a'),
        getEventClosingNow('b'),
        getEventModel('c'),
        getEventOpeningTomorrow((tomorrowId)),
      ];
      state = {
        projectDashboard: {
          projectId,
          events: stateEvents,
        },
      };
    });
    
    describe('and the event is opening', () => {
      
      beforeEach(() => {
        event = { id: 'a', projectId };
        action = actions.updateEventOpenState(event, true);
      });
      
      it('replaces the correct event item in the array with an updated version', () => {
        resultState = updateEventOpenState(state, action);
        projectDashboard = resultState.projectDashboard;
        
        expect(projectDashboard.events).toHaveLength(4);
        expect(projectDashboard.events).not.toBe(stateEvents);
        
        const eventModel = projectDashboard.events.find(e => e.eventId === event.id);
        
        expect(eventModel).toBeDefined();
        expect(eventModel).not.toBe(stateEvents.find(e => e.eventId === event.id));
      });
      
      it('sets isUpcoming, isClosed, and isOpen regardless of evaluated date/times' +
        '(bad user clock should not stop open/close events)', () => {
        action = actions.updateEventOpenState({ id: tomorrowId, projectId }, true);
        resultState = updateEventOpenState(state, action);
        projectDashboard = resultState.projectDashboard;
        
        expect(projectDashboard.events).toHaveLength(4);
        
        const tomorrowEvent = projectDashboard.events.find(e => e.eventId === tomorrowId);
        expect(tomorrowEvent.isUpcoming).toBe(false);
        expect(tomorrowEvent.isOpen).toBe(true);
        expect(tomorrowEvent.isClosed).toBe(false);
      });
      
      it('leaves all the other models as they are', () => {
        resultState = updateEventOpenState(state, action);
        projectDashboard = resultState.projectDashboard;
        
        expect(projectDashboard.events).toHaveLength(4);
        expect(projectDashboard.events).not.toBe(stateEvents);
        
        stateEvents.filter(e => e.eventId !== event.id)
          .forEach(eBefore => expect(projectDashboard.events
            .find(eAfter => eBefore.eventId === eAfter.eventId))
            .toBe(eBefore));
      });
    });
    
    describe('and the event is closing', () => {
      
      beforeEach(() => {
        event = { id: 'b', projectId };
        action = actions.updateEventOpenState(event, false);
      });
      
      it('replaces the correct event item in the array with an updated version', () => {
        resultState = updateEventOpenState(state, action);
        projectDashboard = resultState.projectDashboard;
        
        expect(projectDashboard.events).toHaveLength(4);
        expect(projectDashboard.events).not.toBe(stateEvents);
        
        const eventModel = projectDashboard.events.find(e => e.eventId === event.id);
        
        expect(eventModel).toBeDefined();
        expect(eventModel).not.toBe(stateEvents.find(e => e.eventId === event.id));
      });
      
      it('leaves all the other models as they are', () => {
        resultState = updateEventOpenState(state, action);
        projectDashboard = resultState.projectDashboard;
  
        expect(projectDashboard.events).toHaveLength(4);
        expect(projectDashboard.events).not.toBe(stateEvents);
        
        stateEvents.filter(e => e.eventId !== event.id)
          .forEach(eBefore =>
            expect(projectDashboard.events
              .find(eAfter => eBefore.eventId === eAfter.eventId)).toBe(eBefore));
      });
      
      it('sets isUpdated, isOpen, isClosed appropriately', () => {
        resultState = updateEventOpenState(state, action);
        projectDashboard = resultState.projectDashboard;
  
        const eventModel = projectDashboard.events.find(e => e.eventId === event.id);
        expect(eventModel.isUpcoming).toBe(false);
        expect(eventModel.isOpen).toBe(false);
        expect(eventModel.isClosed).toBe(true);
      });
    });
  });
});

function getEventOpeningNow(eventId) {
  return getEventModel(eventId, moment.tz(timeZone), moment.tz(timeZone).add('days', 1));
}

function getEventClosingNow(eventId) {
  return getEventModel(eventId, moment.tz(timeZone).add('days', -1), moment.tz(timeZone));
}

function getEventOpeningTomorrow(eventId) {
  return getEventModel(eventId, moment.tz(timeZone).add('days', 1), moment.tz(timeZone).add('days', 2));
}

function getEventModel(eventId, open = moment.tz(timeZone).add('days', -2), close = moment.tz(timeZone).add('days', 2)) {
  return new ParticipantProjectDashboardEventModel({
    id: `${eventId}-user-id`, // This field is '<eventId><userId>'
    userId: 'user-id',
    projectId,
    eventId,
    isActive: true,
    eventType: EventTypes.individualActivity,
    name: 'event name',
    incentiveAmount: 100,
    opensOn: moment.tz(open, timeZone),
    closesOn: moment.tz(close, timeZone),
    timeZone,
    completedOn: moment.tz(null, timeZone),
    repeatUnit: RepeatUnits.none,
    firstParticipantResponseOn: moment.tz(null, timeZone),
    lastParticipantResponseOn: moment.tz(null, timeZone),
    minimumRepetitionCompletionCount: 1,
    maximumRepetitionCompletionCount: null,
    totalIntervalCount: 1,
    totalIntervalCompletionCount: 0,
    missedIntervalCount: 0,
    intervalRepetitionCompletionCount: 0,
    activeIntervalCompletedOn: moment.tz(null, timeZone),
    totalRepetitionCompletionCount: 0,
    lastCompletedRepetitionId: null,
    activeRepetitionId: 'entry-id',
    activeRepetitionClosesOn: moment.tz(close, timeZone),
    activeRepetitionHasReceivedResponse: false,
    activeRepetitionStatus: CompletionStatuses.created,
    nextIntervalAvailableOn: moment.tz(null, timeZone),
    probeCount: 0,
    probes: [],
    oldestProbeId: null,
    oldestProbeRepetitionId: null,
    repetitionIds: ['entry-id'],
  });
}
