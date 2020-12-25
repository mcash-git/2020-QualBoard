export function compareByDateTime(a, b, sortOrder = 'desc') {
  if (a < b) {
    return sortOrder === 'desc' ? 1 : -1;
  }
  
  return sortOrder === 'desc' ? -1 : 1;
}
