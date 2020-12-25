import { createLogic } from 'redux-logic';
import { fetchStatuses } from 'shared/enums/fetch-statuses';
import { actions } from '../../all-actions';

const { setFetchStatus, set } = actions.annotations;

export default createLogic({
  type: `${actions.annotations.fetch}`,
  async process({ action, annotationsClient }, dispatch, done) {
    const { projectId } = action.payload;
    dispatch(setFetchStatus({ projectId, fetchStatus: fetchStatuses.pending }));
    try {
      const annotations = await annotationsClient.searchByProject(projectId);

      dispatch(set({ projectId, annotations }));
      dispatch(setFetchStatus({ projectId, fetchStatus: fetchStatuses.success }));
    } catch (e) {
      // ?
      console.error('There was an error fetching / setting the project\'s annotations', e);
      dispatch(setFetchStatus({ projectId, fetchStatus: fetchStatuses.failure }));
    }
    done();
  },
});
