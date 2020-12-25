import moment from 'moment';
import 'moment-timezone';

export class DateTimeFormatValueConverter {
  toView(value, format, zone) {
    if (!zone) {
      return moment(value).format(format);
    }
    const formatted = moment(value).format(format);
    return moment.tz(formatted, zone).format(format);
  }
}
