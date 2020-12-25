import { createLogic } from 'redux-logic';
import participantMediaAppliedFiltersSelector from 'researcher/state/participant-media-applied-filters/selectors/participant-media-applied-filters-selector';
import { actions } from '../../all-actions';

export default createLogic({
  type: `${actions.participantMediaAppliedFilters.toggleAssetType}`,
  async process({ getState, action }, dispatch, done) {
    const { assetType } = action.payload;

    const appliedFilters = participantMediaAppliedFiltersSelector(getState());

    const idx = appliedFilters.assetTypes.indexOf(assetType);
    if (idx === -1) {
      dispatch(actions.participantMediaAppliedFilters.addAssetType(action.payload));
    } else {
      dispatch(actions.participantMediaAppliedFilters.removeAssetType(action.payload));
    }
    done();
  },
});
