import { arrayUtilities } from 'shared/utility/array-utilities';

export default (state, action) => {
  const { jobUpdate } = action.payload;
  const index = state.findIndex((j) => j.id === jobUpdate.id);
  const job = state[index];
  return arrayUtilities.replace(state, index, {
    ...job,
    ...jobUpdate,
  });
};
