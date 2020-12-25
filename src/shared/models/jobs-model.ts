import { JobModel } from './job-model';
import { dateTimeUtility } from 'shared/utility/date-time-utility';
import * as moment from 'moment';

interface IJobs {
  today: JobModel[];
  yesterday: JobModel[];
  week: JobModel[];
  older: JobModel[];
}

export class JobsModel implements IJobs {
  public today:JobModel[];
  public yesterday:JobModel[];
  public week:JobModel[];
  public older: JobModel[];

  constructor(model:IJobs) {
    this.today = model.today || null;
    this.yesterday = model.yesterday || null;
    this.week = model.week || null;
    this.older = model.older || null;
  }

  static fromDto(jobs:any[], currentUserTimeZone) {
    if (!jobs) {
      throw 'Jobs must be defined';
    }

    const today = moment();
    const yesterday = moment().subtract(1, 'day');

    return jobs.reduce((sorted, j) => {
      const job = JobModel.fromDto(j, currentUserTimeZone);
      const startedOn = job.createdOn;

      if (dateTimeUtility.isToday(startedOn, today)) {
        sorted.today.push(job);
      } else if (dateTimeUtility.isYesterday(startedOn, yesterday)) {
        sorted.yesterday.push(job);
      } else if (dateTimeUtility.isWeek(startedOn, today)) {
        sorted.week.push(job);
      } else {
        sorted.older.push(job);
      }

      return sorted;
    }, {today: [], yesterday: [], week: [], older: []});
  }
}
