import replace from './replace';

export default (array, condition, item) => {
  const index = array.findIndex(condition);
  
  if (index === -1) {
    throw new Error('Unable to replace the item; item not found.');
  }
  
  return replace(array, index, item);
};
