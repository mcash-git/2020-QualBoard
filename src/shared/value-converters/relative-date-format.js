import moment from 'moment';

export class RelativeDateFormatValueConverter {
  toView(value, defaultValue = '-') {
    const mom = moment(value);
    if (!mom.isValid()) {
      return defaultValue;
    }
    return mom.fromNow();
  }
}
