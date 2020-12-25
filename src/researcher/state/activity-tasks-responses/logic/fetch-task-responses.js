import { createLogic } from 'redux-logic';
import { fetchStatuses } from 'shared/enums/fetch-statuses';
import { actions } from '../../all-actions';

const fetchTaskResponses = createLogic({
  type: `${actions.activityTasksResponses.fetch}`,
  latest: true,
  async process({ api, action }, dispatch, done) {
    const { projectId, iaId, taskId } = action.payload;

    actions.activityTasksResponses.setFetchStatus({
      taskId,
      fetchStatus: fetchStatuses.pending,
    });

    try {
      const responses = await api.query.taskResponses.getForTask({ projectId, iaId, taskId });
      dispatch(actions.activityTasksResponses.setTaskResponses({ projectId, taskId, responses }));

      dispatch(actions.activityTasksResponses.setFetchStatus({
        taskId,
        fetchStatus: fetchStatuses.success,
      }));
    } catch (error) {
      console.error('There was an error fetching responses for the task.', {
        error,
      });

      dispatch(actions.activityTasksResponses.setFetchStatus({
        taskId,
        fetchStatus: fetchStatuses.failure,
      }));
    }
    done();
  },
});

export default fetchTaskResponses;
