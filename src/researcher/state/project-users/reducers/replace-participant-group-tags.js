import createTransformNestedProjectKeyedReducer from 'shared/utility/state/create-transform-nested-project-keyed-reducer';
import { arrayUtilities } from 'shared/utility/array-utilities';

export default createTransformNestedProjectKeyedReducer('users', ({ userId, tagIds }, users) => {
  const index = users.findIndex((u) => u.userId === userId);
  const existingUser = users[index];
  return arrayUtilities.replace(users, index, {
    ...existingUser,
    groupTags: tagIds,
  });
});
