import createTransformKeyedReducer from './create-transform-keyed-reducer';

const createTransformTaskKeyedReducer = (transform, cancelIfUndefined = true) =>
  createTransformKeyedReducer('taskId', transform, cancelIfUndefined);

export default createTransformTaskKeyedReducer;
