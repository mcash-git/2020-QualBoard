import get from 'lodash.get';

const defaultFormat = 'M/D/YYYY h:mm A';

export const formatMoment = (momentObj, timeZone = null, format = defaultFormat) => (
  momentHasTimeZone(momentObj, timeZone) ?
    momentObj.format(format) :
    momentObj.tz(timeZone).format(format));

function momentHasTimeZone(momentObj, timeZone) {
  return timeZone === null || get(momentObj, '_z.name') === timeZone;
}
