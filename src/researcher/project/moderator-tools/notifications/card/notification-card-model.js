import { computedFrom } from 'aurelia-framework';
import moment from 'moment';

export class NotificationCardModel {
  constructor({
    id = null,
    userId = null,
    projectId = null,
    eventId = null,
    triggeredByUserId = null,
    type = null,
    title = null,
    subtitle = null,
    body = null,
    url = null,
    createdDate = null,
    isRead = null,
    isToday = false,
    isYesterday = false,
    isWeek = false,
    isOlder = false,
    isSelected = false,
  }) {
    this.id = id;
    this.userId = userId;
    this.projectId = projectId;
    this.eventId = eventId;
    this.triggeredByUserId = triggeredByUserId;
    this.type = type;
    this.title = title;
    this.subtitle = subtitle;
    this.body = body;
    this.url = url;
    this.createdDate = createdDate;
    this.isRead = isRead;
    this.isToday = isToday;
    this.isYesterday = isYesterday;
    this.isWeek = isWeek;
    this.isOlder = isOlder;
    this.isSelected = isSelected;
  }

  @computedFrom('type')
  get icon() {
    let icon = null;
    switch (this.type) {
      // message
      case 1:
        icon = 'icon-ion-android-mail';
        break;
      // followups
      case 'followup-response':
        icon = 'icon-ion-reply';
        break;
      // activity
      case 'event-open':
      case 'event-close':
        icon = 'icon-noun_640064';
        break;
      // backroom
      case 4:
        icon = 'icon-noun_146096';
        break;
      default:
        break;
    }
    return icon;
  }

  @computedFrom('createdDate')
  get timeAgo() {
    // how many days ago
    let time = moment().diff(moment(this.createdDate), 'days');
    let interval = 'day';

    if (time === 0) {
      // how many hours ago
      time = moment().diff(moment(this.createdDate), 'hours');
      interval = 'hour';
      if (time === 0) {
        // how many minutes ago
        time = moment().diff(moment(this.createdDate), 'minutes');
        interval = 'minute';
      }
    }
    if (time > 1) {
      interval = `${interval}s`;
    } else if (time === 0) {
      return 'less than 1 minute ago';
    }
    return `${time} ${interval} ago`;
  }
}
