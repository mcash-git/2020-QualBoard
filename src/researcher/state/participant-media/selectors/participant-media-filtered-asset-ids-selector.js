import { createSelector } from 'reselect';

export default createSelector(
  (state) => state.project.id,
  (state) => state.participantMedia,
  (projectId, allParticipantMediaState) => {
    const participantMediaState = allParticipantMediaState[projectId];
    return (participantMediaState && participantMediaState.filteredAssetIds);
  },
);
