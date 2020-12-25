import moment from 'moment-timezone';
import { DateTimeService } from 'shared/components/date-time-service';

const format = 'MM/DD/YYYY h:mm A';

export class DateFormatValueConverter {
  static inject = [DateTimeService];
  constructor(dateTimeService) {
    this.dateTimeService = dateTimeService;
  }
  toView(value, timeZoneFriendly) {
    const isIana = moment.tz.zone(timeZoneFriendly);
    if (isIana) {
      return moment.tz(value, timeZoneFriendly).format(format);
    }
    if (timeZoneFriendly) {
      const tz = this.dateTimeService.getTimeZoneFromFriendly(timeZoneFriendly).utc[0];
      return moment.tz(value, tz).format(format);
    }

    return moment(value).format(format);
  }
}
