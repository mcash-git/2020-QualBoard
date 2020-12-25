import { createSelector } from 'reselect';
import { fetchStatuses } from 'shared/enums/fetch-statuses';

export default createSelector(
  (state) => state.project.id,
  (state) => state.participantMedia,
  (projectId, allParticipantMediaState) => {
    const participantMediaState = allParticipantMediaState[projectId];
    return (participantMediaState && participantMediaState.fetchStatus) || fetchStatuses.pending;
  },
);
