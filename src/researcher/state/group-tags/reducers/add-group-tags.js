import createTransformNestedProjectKeyedReducer from 'shared/utility/state/create-transform-nested-project-keyed-reducer';

export default createTransformNestedProjectKeyedReducer('tags', ({ tags }, existingTags) =>
  existingTags.concat(tags));
