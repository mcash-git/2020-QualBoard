import replace from './replace';

export default (array, condition, item) => {
  const index = array.findIndex(condition);
  const existing = array[index];
  return replace(array, index, {
    ...existing,
    ...item,
  });
};
