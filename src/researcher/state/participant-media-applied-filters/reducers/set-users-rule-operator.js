import createTransformNestedProjectKeyedReducer from 'shared/utility/state/create-transform-nested-project-keyed-reducer';

export default createTransformNestedProjectKeyedReducer(
  'appliedFilters',
  ({ operator }, stateFilters) => ({
    ...stateFilters,
    usersRule: {
      ...stateFilters.usersRule,
      operator,
    },
  }),
  false,
);
