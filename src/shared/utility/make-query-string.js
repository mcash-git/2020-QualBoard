export function makeQueryString(obj) {
  if (!obj || Object.keys(obj).length === 0) { return ''; }

  const valuePairs = Object.keys(obj)
    .map(key => ({ key, value: obj[key] }))
    .sort((a, b) => a.key.localeCompare(b.key));

  const stringPairs = valuePairs
    .map(pair => {
      const values = Array.isArray(pair.value) ? pair.value : [pair.value];
      return values.map(val => `${encodeURIComponent(pair.key)}=${encodeURIComponent(val)}`);
    }).reduce((a, b) => a.concat(b), []);
  return `?${stringPairs.join('&')}`;
}
