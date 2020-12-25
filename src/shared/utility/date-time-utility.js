/* eslint-disable */
import moment, * as moments from 'moment';

export const dateTimeUtility = {
  isToday: (date, today = moment()) => {
    return moment(date).isSame(today, 'day');
  },
  isYesterday: (date, yesterday = moment().subtract(1, 'day')) => {
    return moment(date).isSame(yesterday, 'day');
  },
  isWeek: (date, today = moment()) => {
    return moment(date).isSame(today, 'week');
  },
  checkDateRange: (date) => {
    if (this.isToday(date)) {
      return 'today';
    }
    if (this.isYesterday(date)) {
      return 'yesterday';
    }
    if (this.isWeek(date)) {
      return 'week';
    }
    return 'older';
  },
}
