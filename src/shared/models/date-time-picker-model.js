import { computedFrom } from 'aurelia-framework';
import moment from 'moment';

const offsetRegex = /(([-+])\d{1,2}:\d\d)|(Z)$/i;
export class DateTimePickerModel {
  date = '';
  time = '';

  static dateFormat = 'MM/DD/YYYY';
  static timeFormat = 'h:mm A';

  constructor({
    datePlaceholderText = 'Date',
    timePlaceholderText = 'Time',
    defaultDate = null,
    defaultTime = null,

    // example value: '2016-11-04T13:00:00Z'
    dateTimeText = null,
  } = {}) {
    this.datePlaceholderText = datePlaceholderText;
    this.timePlaceholderText = timePlaceholderText;

    if (defaultDate) {
      this.date = moment(defaultDate).format(DateTimePickerModel.dateFormat);
    }

    if (defaultTime) {
      this.time = moment(defaultTime, 'HH:mm:ss').format(DateTimePickerModel.timeFormat);
    }

    if (dateTimeText) {
      this.dateTimeText = dateTimeText;
    } else {
      this.moment = moment('invalid');
    }
  }

  set dateTimeText(dateTimeText) {
    // set the date and time values
    const dtt = dateTimeText.replace(offsetRegex, '');
    this.moment = moment(dtt);
    this.date = this.moment.format(DateTimePickerModel.dateFormat);
    this.time = this.moment.format(DateTimePickerModel.timeFormat);
  }

  @computedFrom('date', 'time')
  get dateTimeText() {
    return momentToDateTimeText(this.dateMoment, this.timeMoment);
  }

  @computedFrom('date')
  get dateMoment() {
    return moment(this.date, DateTimePickerModel.dateFormat);
  }

  @computedFrom('time')
  get timeMoment() {
    return moment(this.time, DateTimePickerModel.timeFormat);
  }
}

export function momentToDateTimeText(dateMoment, timeMoment) {
  const dateText = dateMoment.format('YYYY-MM-DD');
  const timeText = timeMoment.format('HH:mm:ss');
  const dtt = `${dateText}T${timeText}`;
  return dtt;
}
