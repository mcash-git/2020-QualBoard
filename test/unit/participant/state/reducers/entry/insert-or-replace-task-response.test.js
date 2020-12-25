import moment from 'moment-timezone';
import { ParticipantEntryModel } from 'participant/models/participant-entry-model';
import { receiveTaskResponse } from 'participant/state/actions/all';
import { ParticipantTaskResponseModel } from 'participant/models/participant-task-response-model';
import entryNew from 'dtos/entry-new.json';
import entryCompleted from 'dtos/entry-completed.json';
import projectUsers from 'dtos/project-users.json';
import { insertOrReplaceTaskResponse } from 'participant/state/reducers/entry/insert-or-replace-task-response';
import { ParticipantTaskModel } from 'participant/models/participant-task-model';

const userTimeZone = 'America/Chicago';
const mediaApiUrl = 'https://2020.2020.2020/api';
const projectUserLookup = new Map(projectUsers.map(u => [u.id, u]));
const participantUserId = 'participant';
const moderatorUserId = 'moderator';
const now = moment().format();

describe('insertOrReplaceTaskResponse()', () => {
  let state;
  let entryState;
  let entryStateModel;
  let responseModel;
  let action;
  let result;
  let resultEntry;
  let dto;

  describe('when the user is viewing a different entry', () => {
    beforeEach(() => {
      const someOtherId = 'some-other-entry';
      entryStateModel = new ParticipantEntryModel({ id: someOtherId });
      entryState = {
        entryId: 'some-other-entry',
        entry: entryStateModel,
      };
      state = {
        entry: entryState,
      };
      responseModel = new ParticipantTaskResponseModel({
        entryId: entryNew.id,
        taskId: entryNew.nextTask.id,
        respondedOn: moment.tz(now, userTimeZone),
      });
      action = receiveTaskResponse(responseModel);
      result = insertOrReplaceTaskResponse(state, action);
    });

    it('returns state unchanged', () => {
      expect(result).toBe(state);
    });
  });

  describe('when the user is not viewing an entry', () => {
    beforeEach(() => {
      entryStateModel = null;
      entryState = {
        entryId: null,
        entry: entryStateModel,
      };
      state = {
        entry: entryState,
      };
      responseModel = new ParticipantTaskResponseModel({
        entryId: entryNew.id,
        respondedOn: moment.tz(now, userTimeZone),
        taskId: entryNew.nextTask.id,
      });
      action = receiveTaskResponse(responseModel);
      result = insertOrReplaceTaskResponse(state, action);
    });

    it('returns state unchanged', () => {
      expect(result).toBe(state);
    });
  });

  describe('when the user is viewing the entry', () => {
    describe('and response is a direct task response', () => {
      describe('and task is at entry.nextTask', () => {
        beforeEach(() => {
          entryStateModel =
            ParticipantEntryModel.fromDto(
              entryNew,
              mediaApiUrl,
              mediaApiUrl,
              userTimeZone,
              projectUserLookup,
            );
          entryState = {
            entryId: entryStateModel.id,
            entry: entryStateModel,
          };
          state = {
            entry: entryState,
          };
          dto = {
            repetitionId: entryStateModel.id,
            text: 'I am responding!',
            userId: participantUserId,
            taskPromptId: entryStateModel.nextTask.id,
            individualActivityId: entryStateModel.individualActivityId,
            responseTimeStamp: now,
          };
          responseModel = ParticipantTaskResponseModel.fromDto(
            dto,
            {},
            mediaApiUrl,
            mediaApiUrl,
            userTimeZone,
            projectUserLookup,
            true,
          );
          action = receiveTaskResponse(responseModel);
          result = insertOrReplaceTaskResponse(state, action);
          resultEntry = result.entry.entry;
        });

        it('does not modify existing state', () => {
          expect(result).not.toBe(state);
          expect(result.entry).not.toBe(entryState);
          expect(resultEntry).not.toBe(entryStateModel);
          expect(resultEntry.completedTasks).not.toBe(entryStateModel.completedTasks);
        });

        it('nullifies nextTask', () => {
          expect(resultEntry.nextTask).toBeNull();
        });

        it('moves the task to completedTasks', () => {
          expect(resultEntry.completedTasks).toHaveLength(1);

          const task = resultEntry.completedTasks[0];
          expect(task.id).toBe(entryStateModel.nextTask.id);
          expect(task).not.toBe(entryStateModel.nextTask);
        });

        it('sets the response of the completed task', () => {
          expect(resultEntry.completedTasks).toHaveLength(1);
          expect(resultEntry.completedTasks[0].response).toEqual(responseModel);
        });

        it('adds the response to task.allResponses', () => {
          expect(resultEntry.completedTasks).toHaveLength(1);
          expect(resultEntry.completedTasks[0].allResponses).toEqual([responseModel]);
        });
      });

      describe('and task is in entry.completedTasks', () => {
        beforeEach(() => {
          entryStateModel =
            ParticipantEntryModel.fromDto(
              entryNew,
              mediaApiUrl,
              mediaApiUrl,
              userTimeZone,
              projectUserLookup,
            );
          const task = entryStateModel.nextTask;
          entryStateModel.completedTasks = [task];
          entryStateModel.nextTask = null;
          entryState = {
            entryId: entryStateModel.id,
            entry: entryStateModel,
          };
          state = {
            entry: entryState,
          };
          dto = {
            repetitionId: entryStateModel.id,
            text: 'I am responding!',
            userId: participantUserId,
            taskPromptId: task.id,
            individualActivityId: entryStateModel.individualActivityId,
            responseTimeStamp: now,
          };
          responseModel = ParticipantTaskResponseModel.fromDto(
            dto,
            {},
            mediaApiUrl,
            mediaApiUrl,
            userTimeZone,
            projectUserLookup,
          );
          action = receiveTaskResponse(responseModel);
          result = insertOrReplaceTaskResponse(state, action);
          resultEntry = result.entry.entry;
        });

        it('does not modify existing state', () => {
          expect(result).not.toBe(state);
          expect(result.entry).not.toBe(entryState);
          expect(resultEntry).not.toBe(entryStateModel);
          expect(resultEntry.completedTasks).not.toBe(entryStateModel.completedTasks);
        });

        it('replaces the task in completedTasks with a clone', () => {
          expect(resultEntry.completedTasks).toHaveLength(1);

          const task = resultEntry.completedTasks[0];

          expect(task).not.toBe(entryStateModel.completedTasks[0]);
          expect(task.constructor.name).toBe(ParticipantTaskModel.name);
          expect(task.id).toBe(entryStateModel.completedTasks[0].id);
        });

        it('sets the response of the completed task', () => {
          expect(resultEntry.completedTasks).toHaveLength(1);
          expect(resultEntry.completedTasks[0].response).toEqual(responseModel);
        });

        it('replaces the existing optimistic response in task.allResponses', () => {
          expect(resultEntry.completedTasks).toHaveLength(1);
          expect(resultEntry.completedTasks[0].allResponses).toEqual([responseModel]);
        });
      });
    });

    describe('and response is a mod required followup', () => {
      let task;
      let parentResponse;
      let resultTask;
      let resultParentResponse;
      beforeEach(() => {
        entryStateModel = ParticipantEntryModel
          .fromDto(entryCompleted, mediaApiUrl, mediaApiUrl, userTimeZone, projectUserLookup);
        entryState = {
          entryId: entryStateModel.id,
          entry: entryStateModel,
        };
        state = {
          entry: entryState,
        };
        task = entryStateModel.completedTasks[1];
        parentResponse = task.response;
        dto = {
          repetitionId: entryStateModel.id,
          text: 'This is a required followup from the mod',
          userId: moderatorUserId,
          taskPromptId: task.id,
          individualActivityId: entryStateModel.individualActivityId,
          parentResponseId: parentResponse.id,
          responseTimeStamp: now,
          // back end needs to rename this to isRequiredFollowup
          isProbe: true,
        };
        responseModel = ParticipantTaskResponseModel.fromDto(
          dto,
          {},
          mediaApiUrl,
          mediaApiUrl,
          userTimeZone,
          projectUserLookup,
        );
        action = receiveTaskResponse(responseModel);
        result = insertOrReplaceTaskResponse(state, action);
        resultEntry = result.entry.entry;
        resultTask = resultEntry.completedTasks[1];
        resultParentResponse = resultTask.response;
      });

      it('does not modify existing state', () => {
        expect(result).not.toBe(state);
        expect(result.entry).not.toBe(entryState);
        expect(resultEntry).not.toBe(entryStateModel);
        expect(resultEntry.completedTasks).not.toBe(entryStateModel.completedTasks);
      });

      it('replaces the task in completedTasks with a clone', () => {
        expect(resultEntry.completedTasks).toHaveLength(3);
        expect(resultTask).not.toBe(entryStateModel.completedTasks[1]);
        expect(resultTask.constructor.name).toBe(ParticipantTaskModel.name);
        expect(resultTask.id).toBe(entryStateModel.completedTasks[1].id);
      });

      it('leaves other tasks unmodified', () => {
        expect(resultEntry.completedTasks).not.toBe(entryStateModel.completedTasks);
        expect(resultEntry.completedTasks[0]).toEqual(entryStateModel.completedTasks[0]);
        expect(resultEntry.completedTasks[2]).toEqual(entryStateModel.completedTasks[2]);
      });

      it('replaces the parentResponse (task-response) in the completed task with a clone', () => {
        expect(resultParentResponse.id).toBe(parentResponse.id);
        expect(resultParentResponse).not.toBe(parentResponse);
      });

      it('pushes the required followup into the cloned parentResponse\'s .responses array', () => {
        expect(resultParentResponse.responses).not.toBe(parentResponse.responses);
        expect(resultParentResponse.responses).toHaveLength(parentResponse.responses.length + 1);

        const resultFollowup = resultParentResponse.responses.find(r => r.id === responseModel.id);

        expect(resultFollowup).toBeDefined();
        expect(resultFollowup.id).toBe(responseModel.id);
        expect(resultFollowup.text).toBe(responseModel.text);
      });

      it('adds the response to task.allResponses', () => {
        expect(resultTask.allResponses).toHaveLength(task.allResponses.length + 1);
        expect(resultTask.allResponses.some(r => r.id === responseModel.id));
      });
    });
  });
});
