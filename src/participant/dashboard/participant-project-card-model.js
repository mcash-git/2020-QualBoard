import moment from 'moment-timezone';
import { computedFrom } from 'aurelia-framework';
import { ButtonModel, buttonTypes } from 'shared/components/button-model';

const dateFormatString = 'M/D/YYYY h:mm A';

export class ParticipantProjectCardModel {
  constructor(project = {}, currentUser) {
    this.currentUser = currentUser;
    this.closeTime = project.closeTime || null;
    this.openTime = project.openTime || null;
    this.bottomStatItems = [];
    this.button = buildButtonModel(project);
    this.subtitle = null;
    this.title = project.name;
    this.titleIconClass = 'icon-ion-folder';
    this.height = '12rem';
  }

  @computedFrom('currentUser.timeZone', 'openTime')
  get openFormatted() {
    const open = moment.tz(this.openTime, this.currentUser.timeZone);
    return open.format(dateFormatString);
  }

  @computedFrom('currentUser.timeZone', 'closeTime')
  get closeFormatted() {
    const close = moment.tz(this.closeTime, this.currentUser.timeZone);
    return close.format(dateFormatString);
  }

  @computedFrom('currentUser.timeZone', 'closeTime')
  get timeZoneAbbr() {
    return moment.tz.zone(this.currentUser.timeZone)
      .abbr(moment.tz(this.closeTime, this.currentUser.timeZone).valueOf());
  }
}

function buildButtonModel(project) {
  return new ButtonModel({
    text: 'View Project',
    iconClass: 'icon-ion-chevron-right',
    type: buttonTypes.link,
    href: `/#/participant/projects/${project.id}/users/${project.userId}/dashboard`,
    buttonClasses: 'btn-primary btn-sm',
  });
}
