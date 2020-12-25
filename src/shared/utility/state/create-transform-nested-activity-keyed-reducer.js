import createTransformActivityKeyedReducer from './create-transform-activity-keyed-reducer';

export default (key, transform, cancelIfUndefined = true) =>
  createTransformActivityKeyedReducer((payload, existingState = {}) => ({
    ...existingState,
    [key]: transform(payload, existingState[key]),
  }), cancelIfUndefined);
