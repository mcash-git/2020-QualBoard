function storageAvailable(type) {
  try {
    const storage = window[type];
    const x = '___STORAGE_TEST___';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
}

export function checkSessionStorageAvailable() {
  return storageAvailable('sessionStorage');
}

export function checkLocalStorageAvailable() {
  return storageAvailable('localStorage');
}
