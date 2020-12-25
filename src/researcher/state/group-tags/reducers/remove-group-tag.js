import createTransformNestedProjectKeyedReducer from 'shared/utility/state/create-transform-nested-project-keyed-reducer';
import { arrayUtilities } from 'shared/utility/array-utilities';

export default createTransformNestedProjectKeyedReducer('tags', ({ id }, tags) =>
  arrayUtilities.findAndRemove(tags, (t) => t.id === id));
