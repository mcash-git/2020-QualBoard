import createTransformNestedActivityKeyedReducer from 'shared/utility/state/create-transform-nested-activity-keyed-reducer';

const setActivityLevelFetchStatus =
  createTransformNestedActivityKeyedReducer('fetchStatus', ({ fetchStatus }) =>
    fetchStatus, false);

export default setActivityLevelFetchStatus;
