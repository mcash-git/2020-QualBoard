import { receiveIndividualActivity } from 'participant/state/actions/all';
import { setIndividualActivity } from 'participant/state/reducers/individual-activity/set-individual-activity';
import individualActivityDto from 'dtos/individual-activity.json';
import { ParticipantIndividualActivityModel } from 'participant/models/participant-individual-activity-model';
import * as GetCurrentUserModule from 'participant/state/selectors/get-current-user-state';

GetCurrentUserModule.getCurrentUserState = jest.fn('participant/state/selectors/get-current-user-state');
GetCurrentUserModule.getCurrentUserState.mockImplementation(() => ({
  user: {
    timeZone: 'America/Chicago',
  },
}));

const iaId = individualActivityDto.id;

describe('individual-activity/setIndividualActivity()', () => {
  let state;
  let action;
  let resultState;
  let individualActivity;
  
  beforeEach(() => {
    state = {
      individualActivity: {
        iaId: null,
        individualActivity: null,
      },
    };
    action = receiveIndividualActivity(iaId, individualActivityDto);
    resultState = setIndividualActivity(state, action);
    individualActivity = resultState.individualActivity;
  });
  
  it('sets iaId', () => {
    expect(individualActivity.iaId).toBe(iaId);
  });
  
  it('sets the individual activity as a ParticipantIndividualActivityModel', () => {
    expect(individualActivity.individualActivity).toBeDefined();
    expect(individualActivity.individualActivity.constructor.name)
      .toBe(ParticipantIndividualActivityModel.name);
  });
});
