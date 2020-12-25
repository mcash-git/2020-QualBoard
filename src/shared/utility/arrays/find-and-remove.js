import remove from './remove';

export default (array, condition) => {
  const index = array.findIndex(condition);
  
  if (index === -1) {
    throw new Error('Unable to remove item; item not found.');
  }
  
  return remove(array, index);
};
