import createTransformProjectKeyedReducer from './create-transform-project-keyed-reducer';

export default (key, transform, cancelIfUndefined = true) =>
  createTransformProjectKeyedReducer((payload, existingState = {}) => ({
    ...existingState,
    [key]: transform(payload, existingState[key]),
  }), cancelIfUndefined);
