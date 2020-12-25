export default (array, items) => {
  const unfiltered = array.concat(items);
  const lookup = new Map();
  return unfiltered.filter((item) => {
    if (lookup.has(item)) {
      return false;
    }

    lookup.set(item, true);
    return true;
  });
};
