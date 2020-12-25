import { formatMoment } from './format-moment';

export class MomentFormatValueConverter {
  toView(momentObj, timeZone = null, format) {
    return formatMoment(momentObj, timeZone, format);
  }
}
