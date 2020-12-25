import createTransformNestedProjectKeyedReducer from 'shared/utility/state/create-transform-nested-project-keyed-reducer';
import { arrayUtilities } from 'shared/utility/array-utilities';

export default createTransformNestedProjectKeyedReducer(
  'annotations',
  ({ id }, annotations) => arrayUtilities.findAndRemove(annotations, (a) => a.id === id),
);
