import { createLogic } from 'redux-logic';
import { actions } from '../../all-actions';
import currentProjectUserSelector from '../../project-users/selectors/current-project-user-selector';
import writeTaskResponseResponsesLookupSelector from '../selectors/write-task-response-responses-lookup-selector';

const removeWriteResponse = createLogic({
  type: `${actions.activityTasksResponses.addTaskResponse}`,
  latest: true,
  process({ action, getState }, dispatch, done) {
    const { response } = action.payload;
    const {
      taskPromptId: taskId,
      parentResponseId,
    } = response;

    const allState = getState();

    const writeResponseLookup = writeTaskResponseResponsesLookupSelector(allState);
    const existingWriteResponse = writeResponseLookup.get(parentResponseId);
    const currentProjectUser = currentProjectUserSelector(allState);

    if (existingWriteResponse &&
      currentProjectUser &&
      existingWriteResponse.userId === currentProjectUser.userId) {
      dispatch(actions.writeTaskResponseResponses.removeResponse({ taskId, parentResponseId }));
    }
    done();
  },
});

export default removeWriteResponse;
