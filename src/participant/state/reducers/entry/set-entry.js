import { ParticipantEntryModel } from 'participant/models/participant-entry-model';
import { getAppConfigState } from 'participant/state/selectors/get-app-config-state';
import { getCurrentUserState } from 'participant/state/selectors/get-current-user-state';
import { getProjectUsersState } from 'participant/state/selectors/get-project-users-state';
import {
  defaultAppConfigState,
  defaultCurrentUserState,
  defaultProjectUsersState,
} from 'participant/state/default-state';

export function setEntry(state, action) {
  const { entryId, entry } = action.payload;
  const appConfig = getAppConfigState(state) || defaultAppConfigState;
  const currentUser = getCurrentUserState(state) || defaultCurrentUserState;
  const projectUsersState = getProjectUsersState(state) || defaultProjectUsersState;

  return {
    ...state,
    entry: {
      entryId,
      entry: ParticipantEntryModel.fromDto(
        entry,
        appConfig.media.baseUrl,
        appConfig.media.imageUriBase,
        currentUser.user.timeZone,
        projectUsersState.lookupById,
      ),
    },
  };
}
