import { createLogic } from 'redux-logic';
import { fetchStatuses } from 'shared/enums/fetch-statuses';
import { actions } from '../../all-actions';

const { setFetchStatus, set } = actions.projectUsers;

export default createLogic({
  type: `${actions.projectUsers.fetch}`,
  async process({ action, api }, dispatch, done) {
    const { projectId } = action.payload;
    dispatch(setFetchStatus({ projectId, fetchStatus: fetchStatuses.pending }));
    try {
      const users = await api.query.projectUsers.getProjectUsers(projectId);

      dispatch(set({ projectId, users }));
      dispatch(setFetchStatus({ projectId, fetchStatus: fetchStatuses.success }));
    } catch (e) {
      // ?
      console.error('There was an error fetching / setting the project\'s group tags', e);
      dispatch(setFetchStatus({ projectId, fetchStatus: fetchStatuses.failure }));
    }
    done();
  },
});
