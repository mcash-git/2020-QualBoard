import createTransformNestedProjectKeyedReducer from 'shared/utility/state/create-transform-nested-project-keyed-reducer';

export default createTransformNestedProjectKeyedReducer(
  'appliedFilters',
  ({ tags }, stateFilters) => ({
    ...stateFilters,
    tagsRule: {
      ...stateFilters.tagsRule,
      tags,
    },
  }),
  false,
);
