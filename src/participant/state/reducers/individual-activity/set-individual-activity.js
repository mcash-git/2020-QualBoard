import { ParticipantIndividualActivityModel } from 'participant/models/participant-individual-activity-model';
import { getCurrentUserState } from 'participant/state/selectors/get-current-user-state';
import { defaultCurrentUserState } from 'participant/state/default-state';

export function setIndividualActivity(state, action) {
  const { iaId, individualActivity } = action.payload;
  const currentUserState = getCurrentUserState(state) || defaultCurrentUserState;

  return {
    ...state,
    individualActivity: {
      iaId,
      individualActivity: ParticipantIndividualActivityModel
        .fromDto(individualActivity, currentUserState.user.timeZone),
    },
  };
}
