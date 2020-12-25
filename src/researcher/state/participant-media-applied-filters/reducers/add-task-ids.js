import createTransformNestedProjectKeyedReducer from 'shared/utility/state/create-transform-nested-project-keyed-reducer';
import { arrayUtilities } from 'shared/utility/array-utilities';

export default createTransformNestedProjectKeyedReducer(
  'appliedFilters',
  ({ taskIds }, stateFilters) => ({
    ...stateFilters,
    taskIds: arrayUtilities.union(stateFilters.taskIds, taskIds),
  }),
);
