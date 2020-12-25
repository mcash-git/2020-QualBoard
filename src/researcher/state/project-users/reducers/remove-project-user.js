import createTransformNestedProjectKeyedReducer from 'shared/utility/state/create-transform-nested-project-keyed-reducer';
import { arrayUtilities } from 'shared/utility/array-utilities';

export default createTransformNestedProjectKeyedReducer('users', ({ userId }, users) =>
  arrayUtilities.findAndRemove(users, (t) => t.userId === userId));
