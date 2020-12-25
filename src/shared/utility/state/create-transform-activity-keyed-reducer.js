import createTransformKeyedReducer from './create-transform-keyed-reducer';

export default (transform, cancelIfUndefined = true) =>
  createTransformKeyedReducer('iaId', transform, cancelIfUndefined);
