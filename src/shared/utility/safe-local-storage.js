/* eslint no-console: 0 */

import { checkLocalStorageAvailable } from './storage-available';

const canUse = checkLocalStorageAvailable();

export const safeLocalStorage = {
  getItem(key) {
    if (!canUse) {
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('Encountered an error using localStorage (getItem(key)) when localStorage is available:', e);
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
      localStorage.setItem(key, str);
    } catch (e) {
      console.warn('Encountered an error using localStorage (setItem(key, str)) when localStorage is available:', e);
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
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('Encountered an error using localStorage (removeItem(key)) when localStorage is available:', e);
    }
  },

  clear() {
    throw new Error('You really don\'t want to do this.  oidc-provider depends on localStorage to keep the user logged in.');
  },
};
/**
 * Created by Andrew on 3/31/2017.
 */
