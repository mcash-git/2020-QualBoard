const complement = (array, items) => {
  const lookup = new Map(items.map((item) => [item, true]));

  return array.filter((item) => !lookup.has(item));
};

export default complement;
