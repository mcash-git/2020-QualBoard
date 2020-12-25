import { createLogic } from 'redux-logic';
import { actions } from '../../all-actions';
import currentProjectUserSelector from '../../project-users/selectors/current-project-user-selector';
import writeTaskResponseResponsesLookupSelector from '../selectors/write-task-response-responses-lookup-selector';
import activityTasksResponsesLookupSelector from '../../activity-tasks-responses/selectors/activity-tasks-responses-lookup-selector';

const tryAddResponse = createLogic({
  type: `${actions.writeTaskResponseResponses.tryAddResponse}`,
  latest: true,
  async process({ action, getState }, dispatch, done) {
    const { parentResponseId, taskId } = action.payload;

    const allState = getState();
    const currentProjectUser = currentProjectUserSelector(allState);

    const writeResponseLookup = writeTaskResponseResponsesLookupSelector(allState);

    if (!currentProjectUser ||
      currentProjectUser.role.value !== 'Moderator' ||
      writeResponseLookup.get(parentResponseId)) {
      done();
      return;
    }

    const responseLookup = activityTasksResponsesLookupSelector(allState);
    const parentResponse = responseLookup.get(parentResponseId);
    const response = createResponse(parentResponse, currentProjectUser);

    dispatch(actions.writeTaskResponseResponses.addResponse({ taskId, response }));

    done();
  },
});

function createResponse(parentResponse, user) {
  return {
    ...parentResponse,
    hasResponse: false,
    parentResponseId: parentResponse.id,
    id: null,
    userId: user.userId,
    user,
    parentUserId: parentResponse.userId,
    responseTimeStamp: null,
    text: '',
    plainText: '',
    isProbe: true,
    isActive: true,
    status: null,
  };
}

export default tryAddResponse;
