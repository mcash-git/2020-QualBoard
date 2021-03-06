import createTransformNestedProjectKeyedReducer from 'shared/utility/state/create-transform-nested-project-keyed-reducer';

export default createTransformNestedProjectKeyedReducer(
  'appliedFilters',
  ({ taskIds }, stateFilters) => ({
    ...stateFilters,
    taskIds,
  }),
);
