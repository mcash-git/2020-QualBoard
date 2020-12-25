import add from './add';

export default (array, condition, item) => {
  const index = array.findIndex(condition);
  
  if (index === -1) {
    return add(array, item);
  }
  
  return [
    ...array.slice(0, index),
    item,
    ...array.slice(index + 1),
  ];
};
