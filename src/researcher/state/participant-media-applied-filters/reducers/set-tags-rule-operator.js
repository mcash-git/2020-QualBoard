import createTransformNestedProjectKeyedReducer from 'shared/utility/state/create-transform-nested-project-keyed-reducer';

export default createTransformNestedProjectKeyedReducer(
  'appliedFilters',
  ({ operator }, stateFilters) => ({
    ...stateFilters,
    tagsRule: {
      ...stateFilters.tagsRule,
      operator,
    },
  }),
  false,
);
