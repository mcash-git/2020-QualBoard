import { enums } from '2020-qb4';
import * as moment from 'moment-timezone';

const UserJobStatuses = enums.userJobStatuses;

interface IJob {
  completedOn?:moment;
  createdOn:moment;
  downloadLink?:string;
  externalId:string;
  fileName:string;
  id:string;
  link?:string;
  progress:number;
  status:object;
  title:string;
  userId:string;
  isToday?:boolean;
  isYesterday?:boolean;
  isWeek?:boolean;
  isOlder?:boolean;
}

interface IJobDto {
  completedOn?:string;
  createdOn:string;
  downloadLink?:string;
  externalId:string;
  fileName:string;
  id:string;
  link?:string;
  progress:number;
  status:number;
  title:string;
  userId:string;
}

export class JobModel implements IJob {
  public completedOn:string|null;
  public createdOn:string;
  public downloadLink:string|null;
  public externalId:string;
  public fileName:string;
  public id:string;
  public link:string|null;
  public progress:number;
  public status:object;
  public title:string;
  public userId:string;

  constructor(model:IJob) {
    this.completedOn = model.completedOn || null;
    this.createdOn = model.createdOn;
    this.downloadLink = model.downloadLink;
    this.externalId = model.externalId;
    this.fileName = model.fileName;
    this.id = model.id;
    this.link = model.link;
    this.progress = model.progress;
    this.status = model.status;
    this.title = model.title;
    this.userId = model.userId;
  }

  static fromDto(job:IJobDto, currentUserTimeZone) {
    if (!job.id || !job.createdOn) {
      throw new Error('DTO is invalid. Must contain a job id and createdOn');
    }

    const {
      completedOn,
      createdOn,
      downloadLink,
      externalId,
      fileName,
      id,
      link,
      progress,
      status,
      title,
      userId
    } = job;

    return new JobModel({
      completedOn: completedOn && moment.tz(completedOn, currentUserTimeZone),
      createdOn: moment.tz(createdOn, currentUserTimeZone),
      downloadLink,
      externalId,
      fileName,
      id,
      link,
      progress,
      status: UserJobStatuses[status],
      title,
      userId
    });
  }
}
