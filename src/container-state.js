import moment from 'moment-timezone';
import { computedFrom } from 'aurelia-framework';

export class ContainerState {
  constructor(interval = 1800) {
    this._lastUpdated = null;
    this._errorLog = [];
    this._updateHooks = [];
    this._data = null;

    if (window.ENABLE_CONTAINER_STATE) {
      this.enable(interval);
    }
  }

  enable(interval) {
    this.poll();
    this._intervalHandle = window.setInterval(this.poll.bind(this), interval * 1000);
  }

  destroy() {
    window.clearInterval(this._intervalHandle);
  }

  onUpdate(fn, shouldSkipImmediate) {
    this._updateHooks.push(fn);
    if (!shouldSkipImmediate) { fn(this); }

    return fn;
  }

  clearUpdate(handle) {
    this._updateHooks = this._updateHooks.filter(hook => hook !== handle);
  }

  async poll() {
    try {
      const response = await fetch('/container-state.json');
      const responseData = await response.json();

      this._update(responseData);
    } catch (e) {
      this._errorLog.push({ timestamp: moment(), error: e });
    }
  }

  @computedFrom('_data.MAINTENANCE')
  get maintenance() {
    if (!this._data) { return null; }
    return this._data.MAINTENANCE;
  }

  @computedFrom('_data.VERSION')
  get currentVersion() {
    if (!this._data) { return null; }
    return this._data.VERSION;
  }

  @computedFrom('_lastUpdated')
  get lastUpdated() {
    return this._lastUpdated;
  }

  _update(responseData) {
    this._lastUpdated = moment();
    this._data = responseData;
    this._updateHooks.forEach(fn => fn(this));
  }
}
