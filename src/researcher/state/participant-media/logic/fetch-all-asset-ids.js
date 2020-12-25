import { createLogic } from 'redux-logic';
import { fetchStatuses } from 'shared/enums/fetch-statuses';
import { actions } from '../../all-actions';

const emptyFilters = {
  createdAfter: null,
  createdBefore: null,
  taskIds: [],
  assetTypes: [],
  projectUserLogicRules: [],
  page: 1,
  pageSize: 24,
};

export default createLogic({
  // happens when we explicitly fetch or when applied participant media filters change in any way
  type: `${actions.participantMedia.fetchAllAssetIds}`,
  latest: true,
  async process({ api, action }, dispatch, done) {
    const { projectId } = action.payload;

    try {
      const assetIds = await api.query.projects.getFilteredParticipantMedia({
        ...emptyFilters,
        projectId,
      }, true);

      dispatch(actions.participantMedia.setAllAssetIds({ projectId, assetIds }));
    } catch (error) {
      console.error('There was an error fetching asset IDs of all participant media.', {
        error,
      });

      dispatch(actions.participantMedia.setFetchStatus({
        projectId,
        fetchStatus: fetchStatuses.failure,
      }));
    }
    done();
  },
});
