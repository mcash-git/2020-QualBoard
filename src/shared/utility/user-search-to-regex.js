export function userSearchToRegex(searchText) {
  return new RegExp(escape(searchText), 'gi');
}

function escape(str) {
  return str.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
}
