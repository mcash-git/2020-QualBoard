import { createLogic } from 'redux-logic';
import { fetchStatuses } from 'shared/enums/fetch-statuses';
import { actions } from '../../all-actions';

export default createLogic({
  type: `${actions.participantMediaAppliedFilters.fetchIndividualActivities}`,
  async process({ api, action }, dispatch, done) {
    const { projectId } = action.payload;

    dispatch(actions.participantMediaAppliedFilters.setFetchStatus({
      projectId,
      fetchStatus: fetchStatuses.pending,
    }));

    try {
      const { individualActivities } = await api.query.projects.getParticipantFilters(projectId);
      dispatch(actions.participantMediaAppliedFilters.setAvailableIndividualActivities({
        projectId,
        individualActivities,
      }));
      dispatch(actions.participantMediaAppliedFilters.setFetchStatus({
        projectId,
        fetchStatus: fetchStatuses.success,
      }));
    } catch (error) {
      console.error('There was an error fetching / dispatching available individual activities for participant media filters:', { error });
      dispatch(actions.participantMediaAppliedFilters.setFetchStatus({
        projectId,
        fetchStatus: fetchStatuses.failure,
      }));
    }
    done();
  },
});
