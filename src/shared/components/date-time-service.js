import timeZones from 'timezones.json/timezones.json';
import { Container } from 'aurelia-dependency-injection';
import moment from 'moment';
import 'moment-timezone';
import { CurrentUser } from 'shared/current-user';

export class DateTimeService {
  static inject = [Container];

  constructor(container) {
    this.container = container;
    this.timeZones = timeZones;
    this._buildMaps();
  }

  // TODO: Make this async, and do building of map async as well.
  getFriendlyFromIana(iana) {
    const tz = this.getTimeZoneFromIana(iana);
    return tz ? tz.text : null;
  }

  getTimeZoneFromIana(iana) {
    return this.ianaMap[iana];
  }

  getTimeZoneFromFriendly(friendly) {
    return this.friendlyMap[friendly];
  }

  getBrowserTimeZone() {
    return moment.tz.guess();
  }

  getUserNow(format) {
    const tz = this.user.timeZone || this.getBrowserTimeZone();

    return this.fromUtc(moment.utc(), tz, format);
  }

  // This method assumes that the dateTime passed in IS IN UTC.
  fromUtc(dateTime, timeZone, format) {
    const tz = this._getTimeZoneObject(timeZone);
    return moment.tz(dateTime, tz.utc[0]).format(format);
  }

  // This method assumes that the dateTime passed in IS IN THE TIME ZONE
  // SPECIFIED
  toUtc(dateTime, timeZone, format) {
    const tz = this._getTimeZoneObject(timeZone);
    return moment.tz(dateTime, tz.utc[0]).tz('Etc/GMT').format(format);
  }

  // Builds the map of IANA timezone IDs to the user-friendly ones the user
  // actually selects.

  _buildMaps() {
    // already run
    if (this.ianaMap) {
      return;
    }

    this.ianaMap = {};
    this.friendlyMap = {};

    this.timeZones.forEach(tz => {
      this.friendlyMap[tz.text] = tz;
      if (!tz.utc) {
        return;
      }

      tz.utc.forEach(iana => { this.ianaMap[iana] = tz; });
    });
  }

  _getTimeZoneObject(tz) {
    if (!tz) {
      throw new Error('time zone was not defined, unable to convert date/time.');
    }

    let timeZone = tz;

    // already the object we want.
    if (timeZone.utc && timeZone.value) {
      return timeZone;
    }

    timeZone = this.ianaMap[timeZone]; // eslint-disable-line
    if (timeZone) {
      return timeZone;
    }

    timeZone = this.friendlyMap[tz];
    if (timeZone) {
      return timeZone;
    }

    throw new Error(`unrecognized time zone: ${tz}`);
  }

  get user() {
    if (!this._user) {
      this._user = this.container.get(CurrentUser);
    }
    return this._user;
  }
}
