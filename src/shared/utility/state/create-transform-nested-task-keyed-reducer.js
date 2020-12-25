import createTransformTaskKeyedReducer from './create-transform-task-keyed-reducer';

const createTransformNestedTaskKeyedReducer = (key, transform, cancelIfUndefined = true) =>
  createTransformTaskKeyedReducer((payload, existingState = {}) => ({
    ...existingState,
    [key]: transform(payload, existingState[key]),
  }), cancelIfUndefined);

export default createTransformNestedTaskKeyedReducer;
