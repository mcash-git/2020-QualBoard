import createTransformNestedProjectKeyedReducer from 'shared/utility/state/create-transform-nested-project-keyed-reducer';
import { arrayUtilities } from 'shared/utility/array-utilities';

export default createTransformNestedProjectKeyedReducer(
  'appliedFilters',
  ({ assetType }, stateFilters) => ({
    ...stateFilters,
    assetTypes: arrayUtilities.add(stateFilters.assetTypes, assetType),
  }),
);
