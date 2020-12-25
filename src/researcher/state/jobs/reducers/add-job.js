import { arrayUtilities } from 'shared/utility/array-utilities';

export default (state, action) => {
  const { job } = action.payload;
  return arrayUtilities.add(state, job);
};
