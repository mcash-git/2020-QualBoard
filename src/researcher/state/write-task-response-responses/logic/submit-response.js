import { createLogic } from 'redux-logic';
import { fetchStatuses } from 'shared/enums/fetch-statuses';
import { actions } from '../../all-actions';

const submitTaskResponse = createLogic({
  type: `${actions.writeTaskResponseResponses.submitResponse}`,
  latest: true,
  async process({ api, getState, action }, dispatch, done) {
    const { taskId, response } = action.payload;
    const state = getState();

    const { parentResponseId } = response;

    dispatch(actions.writeTaskResponseResponses.setSubmitStatus({
      taskId,
      parentResponseId,
      status: fetchStatuses.pending,
    }));

    try {
      await api.command.taskResponses.create(toDto(response));
    } catch (error) {
      console.error('There was an error submitting the response.', {
        error,
        state,
      });

      dispatch(actions.writeTaskResponseResponses.setSubmitStatus({
        taskId,
        parentResponseId,
        status: fetchStatuses.failure,
      }));
    }
    done();
  },
});

function toDto(response) {
  return {
    individualActivityId: response.individualActivityId,
    iaId: response.individualActivityId,
    isActive: true,
    isProbe: response.isProbe,
    parentResponseId: response.parentResponseId,
    projectId: response.projectId,
    repetitionId: response.repetitionId,
    taskPromptId: response.taskPromptId,
    text: response.text,
    userId: response.userId,
    media: response.media,
  };
}

export default submitTaskResponse;
