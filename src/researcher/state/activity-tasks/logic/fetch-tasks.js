import { createLogic } from 'redux-logic';
import { fetchStatuses } from 'shared/enums/fetch-statuses';
import { actions } from '../../all-actions';

const fetchTasks = createLogic({
  type: `${actions.activityTasks.fetchTasks}`,
  latest: true,
  async process({ api, action }, dispatch, done) {
    const { projectId, iaId } = action.payload;

    dispatch(actions.activityTasks.setFetchStatus({
      iaId,
      fetchStatus: fetchStatuses.pending,
    }));

    try {
      const { tasks } = await api.query.individualActivities.getTasks(projectId, iaId, false);

      dispatch(actions.activityTasks.setTasks({ projectId, iaId, tasks }));

      dispatch(actions.activityTasks.setFetchStatus({
        iaId,
        fetchStatus: fetchStatuses.success,
      }));
    } catch (error) {
      console.error('There was an error fetching tasks for the activity.', {
        error,
      });

      dispatch(actions.activityTasks.setFetchStatus({
        iaId,
        fetchStatus: fetchStatuses.failure,
      }));
    }
    done();
  },
});

export default fetchTasks;
