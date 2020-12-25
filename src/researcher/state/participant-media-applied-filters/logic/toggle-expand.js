import { createLogic } from 'redux-logic';
import participantMediaAppliedFiltersSelector from 'researcher/state/participant-media-applied-filters/selectors/participant-media-applied-filters-selector';
import { actions } from '../../all-actions';

export default createLogic({
  type: `${actions.participantMediaAppliedFilters.toggleExpand}`,
  async process({ getState, action }, dispatch, done) {
    const { projectId, section } = action.payload;

    const appliedFilters = participantMediaAppliedFiltersSelector(getState());

    const isExpanded =
      appliedFilters && appliedFilters.expandedState && appliedFilters.expandedState[section];

    dispatch(actions.participantMediaAppliedFilters.setExpanded({
      projectId,
      section,
      isExpanded: !isExpanded,
    }));

    done();
  },
});
