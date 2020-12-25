import { enums } from '2020-qb4';
import moment from 'moment';

const FileTypes = enums.reportFileTypes;
const ReportTypes = enums.reportTypes;

export class TranscriptsConfigModel {
  constructor({
    createdBy = null,
    createdOn = null,
    endOn = null,
    fileType = null,
    groupTags = [],
    hideAvatars = false,
    id = null,
    events = [],
    name = null,
    projectId = null,
    showNotices = true,
    startOn = null,
    users = [],
    projectUsers = [],
    projectGroupTags = [],
  } = {}) {
    this.createdBy = createdBy;
    this.createdOn = createdOn;
    this.endOn = endOn;
    this.fileType = fileType;
    this.id = id;
    this.events = events;
    this.name = name;
    this.projectId = projectId;
    this.groupTags = groupTags;
    this.hideAvatars = hideAvatars;
    this.showNotices = showNotices;
    this.startOn = startOn;
    this.users = users;
    this.reportType = ReportTypes.transcript;
    this.projectUsers = projectUsers;
    this.projectGroupTags = projectGroupTags;
  }

  view = 'researcher/project/reports/report-modal/transcripts/transcript-config.js';

  static fromDto(
    {
      createdBy = null,
      createdOn = null,
      fileType = null,
      id = null,
      events = [],
      name = null,
      projectId = null,
      userIds = null,
      groupTagIds = null,
      showNotices = true,
    },
    currentUser,
    projectUsers = [],
    projectGroupTags = [],
  ) {
    const users = userIds && userIds.length > 0 ?
      userIds.map(i => projectUsers.find(u => u.id === i)) :
      [];

    const groupTags = groupTagIds && groupTagIds.length > 0 ?
      groupTagIds.map(i => projectGroupTags.find(t => t.id === i)) :
      [];

    return new TranscriptsConfigModel({
      createdBy,
      createdOn: moment.tz(createdOn, currentUser.timeZone),
      fileType: FileTypes[fileType],
      id,
      events,
      name,
      projectId,
      users,
      groupTags,
      projectUsers,
      projectGroupTags,
      showNotices,
    });
  }

  toDto() {
    return {
      endOn: this.endOn || null,
      fileType: this.fileType.int,
      groupTagIds: this.groupTags.map(t => t.id),
      hideAvatars: this.hideAvatars,
      id: this.id,
      name: this.name,
      events: this.events,
      projectId: this.projectId,
      showNotices: this.showNotices,
      startOn: this.startOn || null,
      userIds: this.users.map(u => u.id),
    };
  }
}
