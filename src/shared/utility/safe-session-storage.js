/* eslint no-console: 0 */

import { checkSessionStorageAvailable } from './storage-available';

const canUse = checkSessionStorageAvailable();

export const safeSessionStorage = {
  getItem(key) {
    if (!canUse) {
      return null;
    }
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      console.warn('Encountered an error using sessionStorage (getItem(key)) when sessionStorage is available:', e);
      return null;
    }
  },

  getObject(key) {
    const storedString = this.getItem(key);

    try {
      return storedString ? JSON.parse(storedString) : null;
    } catch (e) {
      console.warn('Encountered an error parsing stored object:', e);
      return null;
    }
  },

  setItem(key, str) {
    if (!canUse) {
      return;
    }
    try {
      sessionStorage.setItem(key, str);
    } catch (e) {
      console.warn('Encountered an error using sessionStorage (setItem(key, str)) when sessionStorage is available:', e);
    }
  },

  setObject(key, obj) {
    if (!canUse) {
      return;
    }
    try {
      const str = JSON.stringify(obj);
      this.setItem(key, str);
    } catch (e) {
      console.warn('Encountered an error stringifying the object:', e);
    }
  },

  removeItem(key) {
    if (!canUse) {
      return;
    }
    try {
      sessionStorage.removeItem(key);
    } catch (e) {
      console.warn('Encountered an error using sessionStorage (removeItem(key)) when sessionStorage is available:', e);
    }
  },

  clear() {
    throw new Error('You really don\'t want to do this.  oidc-provider depends on sessionStorage to keep the user logged in.');
  },
};
