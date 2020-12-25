export default (bytes) => {
  const thresh = 1000;
  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }
  // TODO:  Investigate whether we need locale support?
  const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return `${bytes.toFixed(1)} ${units[u]}`;
};
