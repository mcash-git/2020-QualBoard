import { receiveEntry } from 'participant/state/actions/all';
import { setEntry } from 'participant/state/reducers/entry/set-entry';
import entryNew from 'dtos/entry-new.json';
import entryCompleted from 'dtos/entry-completed.json';
import { ParticipantEntryModel } from 'participant/models/participant-entry-model';
import * as GetCurrentUserModule from 'participant/state/selectors/get-current-user-state';
import * as GetAppConfigModule from 'participant/state/selectors/get-app-config-state';
import * as GetProjectUsersModule from 'participant/state/selectors/get-project-users-state';

GetCurrentUserModule.getCurrentUserState = jest.fn('participant/state/selectors/get-current-user-state');
GetAppConfigModule.getAppConfigState = jest.fn('participant/state/selectors/get-app-config-state');
GetProjectUsersModule.getProjectUsersState = jest.fn('participant/state/selectors/get-project-users-state');
GetCurrentUserModule.getCurrentUserState.mockImplementation(() => ({
  user: {
    timeZone: 'America/Chicago',
  },
}));
GetAppConfigModule.getAppConfigState.mockImplementation(() => ({
  media: {
    baseUrl: 'media.2020ip.lol',
    imageUriBase: 'media.2020ip.lol',
  },
}));
GetProjectUsersModule.getProjectUsersState.mockImplementation(() => ({
  projectUsers: [],
  lookupById: new Map(),
}));


const iaId = 'some-ia-id';

entryNew.individualActivityId = iaId;
entryCompleted.individualActivityId = iaId;

describe('entry/setEntry()', () => {
  let state;
  let action;
  let resultState;
  let entry;

  beforeEach(() => {
    state = {
      entry: {
        entryId: null,
        entry: null,
      },
    };
    action = receiveEntry(entryNew.id, entryNew);
    resultState = setEntry(state, action);
    entry = resultState.entry;
  });

  it('sets entryId', () => {
    expect(entry.entryId).toBe(entryNew.id);
  });

  it('sets the entry as a ParticipantEntryModel', () => {
    expect(entry.entry).toBeDefined();
    expect(entry.entry.constructor.name).toBe(ParticipantEntryModel.name);
  });
});
