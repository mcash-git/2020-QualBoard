import createTransformNestedTaskKeyedReducer from 'shared/utility/state/create-transform-nested-task-keyed-reducer';

const setTaskLevelFetchStatus =
  createTransformNestedTaskKeyedReducer('fetchStatus', ({ fetchStatus }) =>
    fetchStatus, false);

export default setTaskLevelFetchStatus;
