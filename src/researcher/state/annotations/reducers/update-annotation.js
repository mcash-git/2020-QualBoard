import createTransformNestedProjectKeyedReducer from 'shared/utility/state/create-transform-nested-project-keyed-reducer';
import { arrayUtilities } from 'shared/utility/array-utilities';

export default createTransformNestedProjectKeyedReducer(
  'annotations',
  ({ annotation }, annotations) =>
    arrayUtilities.findAndReplace(annotations, (a) => a.id === annotation.id, annotation),
);
