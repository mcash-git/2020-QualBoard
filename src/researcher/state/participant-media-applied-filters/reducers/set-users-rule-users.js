import createTransformNestedProjectKeyedReducer from 'shared/utility/state/create-transform-nested-project-keyed-reducer';

export default createTransformNestedProjectKeyedReducer(
  'appliedFilters',
  ({ users }, stateFilters) => ({
    ...stateFilters,
    usersRule: {
      ...stateFilters.usersRule,
      users,
    },
  }),
  false,
);
