import createTransformNestedProjectKeyedReducer from 'shared/utility/state/create-transform-nested-project-keyed-reducer';

export default createTransformNestedProjectKeyedReducer(
  'appliedFilters',
  ({ section, isExpanded }, stateFilters) => ({
    ...stateFilters,
    expandedState: {
      ...stateFilters.expandedState,
      [section]: isExpanded,
    },
  }),
  false,
);
