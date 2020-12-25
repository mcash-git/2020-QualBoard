import createTransformNestedProjectKeyedReducer from 'shared/utility/state/create-transform-nested-project-keyed-reducer';
import { arrayUtilities } from 'shared/utility/array-utilities';

export default createTransformNestedProjectKeyedReducer(
  'selectedAssets',
  ({ assetId }, selectedAssets) => {
    const index = selectedAssets.indexOf(assetId);
    return (index === -1) ?
      arrayUtilities.add(selectedAssets, assetId) :
      arrayUtilities.remove(selectedAssets, index);
  },
);
