import createTransformNestedProjectKeyedReducer from 'shared/utility/state/create-transform-nested-project-keyed-reducer';
import { arrayUtilities } from 'shared/utility/array-utilities';

export default createTransformNestedProjectKeyedReducer('users', ({ userUpdate }, users) =>
  arrayUtilities.findAndMerge(users, (u) => u.userId === userUpdate.userId, userUpdate));
