import { receiveTaskResponse } from 'participant/state/actions/all';
import individualActivityDto from 'dtos/individual-activity.json';
import { ParticipantIndividualActivityModel } from 'participant/models/participant-individual-activity-model';
import { addOrRemoveRequiredFollowup } from 'participant/state/reducers/individual-activity/add-or-remove-required-followup';
import { ParticipantTaskResponseModel } from 'participant/models/participant-task-response-model';
import moment from 'moment-timezone';

const individualActivityId = individualActivityDto.id;
const userTimeZone = 'America/Chicago';

describe('individual-activity/addOrRemoveRequiredFollowup()', () => {
  let individualActivityStateModel;
  let individualActivityState;
  let state;
  let action;
  let resultState;
  let responseModel;
  let responseDto;
  let resultStateIndividualActivity;
  let resultIndividualActivity;
  
  describe('when IA has not been loaded', () => {
    beforeEach(() => {
      state = {
        individualActivity: {
          iaId: null,
          individualActivity: null,
        },
      };
      responseDto = {
        id: 'task-2-followup',
        taskPromptId: 'task-2',
        individualActivityId,
        projectId: 'project',
        userId: 'moderator',
        parentUserId: 'participant',
        repetitionId: 'entry-completed',
        parentResponseId: 'task-2-response',
        responseTimeStamp: '2017-08-01T12:24:48.937824Z',
        text: 'A followup, required!',
        plainText: null,
        isActive: true,
      };
      action = receiveTaskResponse(responseDto);
      resultState = addOrRemoveRequiredFollowup(state, action);
    });
    
    it('returns state unchanged', () => {
      expect(resultState).toBe(state);
    });
  });
  
  describe('when the participant is on another IA in the UI', () => {
    beforeEach(() => {
      individualActivityState = {
        iaId: 'some-other-id',
        individualActivity: {},
      };
      state = {
        individualActivity: individualActivityState,
      };
      responseDto = {
        id: 'task-2-followup',
        taskPromptId: 'task-2',
        individualActivityId,
        projectId: 'project',
        userId: 'moderator',
        parentUserId: 'participant',
        repetitionId: 'entry-completed',
        parentResponseId: 'task-2-response',
        responseTimeStamp: '2017-08-01T12:24:48.937824Z',
        text: 'A followup, required!',
        plainText: null,
        isActive: true,
      };
      action = receiveTaskResponse(responseDto);
      resultState = addOrRemoveRequiredFollowup(state, action);
    });
    
    it('returns the state unchanged', () => {
      expect(resultState).toBe(state);
    });
  });
  
  describe('when the participant is viewing the IA in the UI', () => {
    describe('and the response is optimistic', () => {
      it('returns state unchanged', () => {
        beforeEach(() => {
          individualActivityStateModel = ParticipantIndividualActivityModel
            .fromDto(individualActivityDto, userTimeZone);
          individualActivityState = {
            iaId: individualActivityId,
            individualActivity: individualActivityStateModel,
          };
          state = {
            individualActivity: individualActivityState,
          };
          responseModel = new ParticipantTaskResponseModel({
            id: 'response',
            entryId: 'entry-completed',
            taskId: 'task-2',
            individualActivityId,
            parentResponseId: individualActivityStateModel.requiredFollowups[0].id,
            respondedOn: moment.tz(userTimeZone),
            isOptimistic: true,
          });
          action = receiveTaskResponse(responseModel);
          resultState = addOrRemoveRequiredFollowup(state, action);
        });
      });
    });
    
    describe('and neither the response or the parent response is a required followup', () => {
      beforeEach(() => {
        individualActivityStateModel = ParticipantIndividualActivityModel
          .fromDto(individualActivityDto, userTimeZone);
        individualActivityState = {
          iaId: individualActivityId,
          individualActivity: individualActivityStateModel,
        };
        state = {
          individualActivity: individualActivityState,
        };
        responseDto = {
          id: 'task-2-followup',
          taskPromptId: 'task-2',
          individualActivityId,
          projectId: 'project',
          userId: 'moderator',
          parentUserId: 'participant',
          repetitionId: 'entry-completed',
          parentResponseId: 'task-2-response',
          responseTimeStamp: '2017-08-01T12:24:48.937824Z',
          text: 'A followup, not required!',
          plainText: null,
          isActive: true,
          isProbe: false,
        };
        action = receiveTaskResponse(responseDto);
        resultState = addOrRemoveRequiredFollowup(state, action);
      });
  
      it('returns state unchanged', () => {
        expect(resultState).toBe(state);
      });
    });
    
    describe('and the response is a new required followup', () => {
      beforeEach(() => {
        individualActivityStateModel = ParticipantIndividualActivityModel
          .fromDto(individualActivityDto, userTimeZone);
        individualActivityState = {
          iaId: individualActivityId,
          individualActivity: individualActivityStateModel,
        };
        state = {
          garbage: 'potato',
          individualActivity: individualActivityState,
        };
        responseDto = {
          id: 'task-2-followup',
          taskPromptId: 'task-2',
          individualActivityId,
          projectId: 'project',
          userId: 'moderator',
          parentUserId: 'participant',
          repetitionId: 'entry-completed',
          parentResponseId: 'task-2-response',
          responseTimeStamp: '2017-08-01T12:24:48.937824Z',
          text: 'A followup, not required!',
          plainText: null,
          isActive: true,
          isProbe: true,
        };
        action = receiveTaskResponse(responseDto);
        resultState = addOrRemoveRequiredFollowup(state, action);
        resultStateIndividualActivity = resultState.individualActivity;
        resultIndividualActivity = resultStateIndividualActivity.individualActivity;
      });
      
      it('does not modify existing state and clones relevant state tree', () => {
        expect(resultState).not.toBe(state);
        expect(resultState.garbage).toBe(state.garbage);
        expect(resultStateIndividualActivity).not.toBe(state.individualActivity);
        expect(resultIndividualActivity).not.toBe(state.individualActivity.individualActivity);
        expect(resultIndividualActivity.requiredFollowups)
          .not.toBe(state.individualActivity.individualActivity.requiredFollowups);
      });
      
      it('adds the response to `.requiredFollowups`', () => {
        const resultFollowupsArray = resultIndividualActivity.requiredFollowups;
        const originalFollowupsArray =
          state.individualActivity.individualActivity.requiredFollowups;
        expect(resultFollowupsArray).toHaveLength(originalFollowupsArray.length + 1);
        
        const followupOverviewModel = resultFollowupsArray.find(f => f.id === responseDto.id);
        
        expect(followupOverviewModel.id).toEqual(responseDto.id);
      });
    });
    
    describe('and the parent response is a required followup', () => {
      beforeEach(() => {
        individualActivityStateModel = ParticipantIndividualActivityModel
          .fromDto(individualActivityDto, userTimeZone);
        individualActivityState = {
          iaId: individualActivityId,
          individualActivity: individualActivityStateModel,
        };
        state = {
          garbage: 'potato',
          individualActivity: individualActivityState,
        };
        responseDto = {
          id: 'task-2-followup-response',
          taskPromptId: 'task-2',
          individualActivityId,
          projectId: 'project',
          userId: 'participant',
          parentUserId: 'moderator',
          repetitionId: 'entry-completed',
          parentResponseId: individualActivityStateModel.requiredFollowups[0].id,
          responseTimeStamp: '2017-08-01T12:24:48.937824Z',
          text: 'Responding to followup.',
          plainText: null,
          isActive: true,
          isProbe: false,
        };
        action = receiveTaskResponse(responseDto);
        resultState = addOrRemoveRequiredFollowup(state, action);
        resultStateIndividualActivity = resultState.individualActivity;
        resultIndividualActivity = resultStateIndividualActivity.individualActivity;
      });
  
      it('does not modify existing state and clones relevant state tree', () => {
        expect(resultState).not.toBe(state);
        expect(resultState.garbage).toBe(state.garbage);
        expect(resultStateIndividualActivity).not.toBe(state.individualActivity);
        expect(resultIndividualActivity).not.toBe(state.individualActivity.individualActivity);
        expect(resultIndividualActivity.requiredFollowups)
          .not.toBe(state.individualActivity.individualActivity.requiredFollowups);
      });
  
      it('removes the followup from `.requiredFollowups`', () => {
        const resultFollowupsArray = resultIndividualActivity.requiredFollowups;
        const originalFollowupsArray =
          state.individualActivity.individualActivity.requiredFollowups;
    
        expect(resultFollowupsArray).toHaveLength(originalFollowupsArray.length - 1);
        expect(resultFollowupsArray.find(f => f.id === responseModel.parentResponseId))
          .not.toBeDefined();
      });
    });
  });
});
