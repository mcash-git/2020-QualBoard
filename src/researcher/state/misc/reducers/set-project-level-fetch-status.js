import createTransformNestedProjectKeyedReducer from 'shared/utility/state/create-transform-nested-project-keyed-reducer';

const setProjectLevelFetchStatus =
  createTransformNestedProjectKeyedReducer('fetchStatus', ({ fetchStatus }) =>
    fetchStatus);

export default setProjectLevelFetchStatus;
