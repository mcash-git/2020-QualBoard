import { createSelector } from 'reselect';
import { CurrentUser } from 'shared/current-user';

const currentUserSelector = createSelector(
  (state) => state.currentUser,
  (currentUser) => new CurrentUser(currentUser),
);

export default currentUserSelector;
