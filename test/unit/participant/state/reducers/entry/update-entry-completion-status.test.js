import { ParticipantEntryModel } from 'participant/models/participant-entry-model';
import { receiveEntryStatusChange } from 'participant/state/actions/all';
import { updateEntryCompletionStatus } from 'participant/state/reducers/entry/update-entry-completion-status';
import projectUsersDto from 'dtos/project-users.json';
import entryNewDto from 'dtos/entry-new.json';
import completeDto from 'dtos/event-repetition-status-changed-complete.json';
import { enums } from '2020-qb4';

const CompletionStatuses = enums.completionStatuses;
const mediaApiUrl = 'asdf.asdf.asdf/asdf';
const userTimeZone = 'America/Chicago';
const projectUserLookup = new Map(projectUsersDto.map(u => [u.id, u]));

describe('updateEntryCompletionStatus()', () => {
  let entryStateModel;
  let entryState;
  let state;
  let action;
  let result;
  let resultEntry;

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
      action = receiveEntryStatusChange(completeDto);
      result = updateEntryCompletionStatus(state, action);
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
      action = receiveEntryStatusChange(completeDto);
      result = updateEntryCompletionStatus(state, action);
    });

    it('returns state unchanged', () => {
      expect(result).toBe(state);
    });
  });

  describe('when the user viewing the entry of the sent event', () => {
    beforeEach(() => {
      entryStateModel =
        ParticipantEntryModel.fromDto(
          entryNewDto,
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

      action = receiveEntryStatusChange(completeDto);
      result = updateEntryCompletionStatus(state, action);
      resultEntry = result.entry.entry;
    });

    it('does not modify existing state', () => {
      expect(result).not.toBe(state);
      expect(result.entry).not.toBe(entryState);
      expect(result.entry.entryId).toBe(entryState.entryId);
      expect(resultEntry).not.toBe(entryStateModel);
    });

    it('sets the .completionStatus property', () => {
      expect(resultEntry.completionStatus).not.toBe(entryStateModel.completionStatus);
      expect(resultEntry.completionStatus).toEqual(CompletionStatuses.complete);
    });
  });
});
