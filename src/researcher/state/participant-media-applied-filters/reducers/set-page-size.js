import createTransformNestedProjectKeyedReducer from 'shared/utility/state/create-transform-nested-project-keyed-reducer';

export default createTransformNestedProjectKeyedReducer(
  'appliedFilters',
  ({ pageSize }, stateFilters) => ({
    ...stateFilters,
    pageSize,
  }),
);
