import { getIndividualActivityState } from 'participant/state/selectors/get-individual-activity-state';
import { ParticipantFollowupOverviewModel } from 'participant/models/participant-followup-overview-model';
import { defaultIndividualActivityState } from 'participant/state/default-state';

export function addOrRemoveRequiredFollowup(state, action) {
  const { response } = action.payload;
  const individualActivityState =
    getIndividualActivityState(state) || defaultIndividualActivityState;
  if (response.individualActivityId !== individualActivityState.iaId || response.isOptimistic) {
    return state;
  }

  const individualActivityModel = individualActivityState.individualActivity;

  if (response.isRequiredFollowup || response.isProbe) {
    // add the response to unanswered array
    const requiredFollowups = [
      ...individualActivityModel.requiredFollowups,
      toModel(response),
    ];
    const iaClone = individualActivityModel.clone({
      requiredFollowups,
    });

    return {
      ...state,
      individualActivity: {
        ...individualActivityState,
        individualActivity: iaClone,
      },
    };
  }

  const followupIndex = individualActivityModel.requiredFollowups
    .findIndex(f => f.id === response.parentResponseId);
  if (followupIndex !== -1) {
    // remove answered followup.
    const requiredFollowups = [...individualActivityModel.requiredFollowups];
    requiredFollowups.splice(followupIndex, 1);

    const iaClone = individualActivityModel.clone({
      requiredFollowups,
    });

    return {
      ...state,
      individualActivity: {
        ...individualActivityState,
        individualActivity: iaClone,
      },
    };
  }

  return state;
}

function toModel(response) {
  return response.constructor.name === ParticipantFollowupOverviewModel.name ?
    response :
    ParticipantFollowupOverviewModel.fromDto(response);
}
