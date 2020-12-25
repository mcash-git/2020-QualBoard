import createTransformNestedProjectKeyedReducer from 'shared/utility/state/create-transform-nested-project-keyed-reducer';

export default createTransformNestedProjectKeyedReducer(
  'allAssetIds',
  ({ assetIds }) => assetIds,
  false,
);
