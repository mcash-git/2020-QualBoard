import { enums } from '2020-qb4';
import moment from 'moment';

const FileTypes = enums.reportFileTypes;
const ReportTypes = enums.reportTypes;

export class CrosstabConfigModel {
  constructor({
    createdBy = null,
    createdOn = null,
    // enum object
    fileType = null,
    id = null,
    events = [],
    name = null,
    projectId = null,
  } = {}) {
    // validate that the values are what you expect them to be, throw a useful / helpful error
    this.createdBy = createdBy;
    this.createdOn = createdOn;
    this.fileType = fileType;
    this.id = id;
    this.events = events;
    this.name = name;
    this.projectId = projectId;

    // I have no idea what the type is, so you might have to change this.
    this.reportType = ReportTypes.crossTab;
  }

  view = 'researcher/project/reports/report-modal/crosstabs/crosstab-config.js';

  static fromDto({
    // string - id
    createdBy = null,

    // DTO string date representation
    createdOn = null,

    // integer
    fileType = null,
    id = null,
    events = [],
    name = null,
    projectId = null,
  }, currentUser) {
    // if !projectUsers - throw error
    // if !currentUser - throw error

    return new CrosstabConfigModel({
      createdBy,
      createdOn: moment.tz(createdOn, currentUser.timeZone),
      fileType: FileTypes[fileType],
      id,
      events,
      name,
      projectId,
    });
  }

  toDto() {
    // validate, make sure required items are selected (fileType, etc.)

    return {
      events: this.events,
      name: this.name,
      id: this.id,
      // it doesn't hurt anything to send this in the DTO, but I think it's a route param
      projectId: this.projectId,
    };
  }
}
