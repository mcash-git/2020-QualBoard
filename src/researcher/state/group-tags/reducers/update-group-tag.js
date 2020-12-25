import createTransformNestedProjectKeyedReducer from 'shared/utility/state/create-transform-nested-project-keyed-reducer';
import { arrayUtilities } from 'shared/utility/array-utilities';

export default createTransformNestedProjectKeyedReducer('tags', ({ tag }, tags) =>
  arrayUtilities.findAndReplace(tags, (t) => t.id === tag.id, tag));
