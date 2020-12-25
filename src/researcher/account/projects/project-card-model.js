import moment from 'moment-timezone';
import { SplitButtonModel, buttonTypes } from 'shared/components/split-button-model';

const dateFormat = 'M/D/YYYY h:mm A';

export class ProjectCardModel {
  constructor(project = {}, isAdmin) {
    this.project = project;
    const {
      activeEventCount = null,
      closeTime = null,
      openTime = null,
      privateName = null,
      projectUserCount = null,
      publicName = null,
      timeZone = null,
      totalResponseCount = null,
    } = project;
    
    this.title = publicName;
    this.subtitle = `(${privateName})`;
    this.titleIconClass = 'icon-ion-folder';
    
    const openMoment = moment.tz(openTime, timeZone);
    const closeMoment = moment.tz(closeTime, timeZone);
    
    this.labeledDetailItems = [
      { label: 'Open', value: openMoment.format(dateFormat) },
      { label: 'Close', value: closeMoment.format(dateFormat) },
      { label: 'Time Zone', value: moment.tz.zone(timeZone).abbr(closeMoment.valueOf()) },
    ];
    
    this.bottomStatItems = [
      { label: 'Posts', value: totalResponseCount },
      { label: 'Participants', value: projectUserCount },
      { label: 'Events', value: activeEventCount },
    ];
    
    this.button = buildButtonModel(project, isAdmin);
  }
}

function buildButtonModel(project, isAdmin) {
  const baseUrl = isAdmin ?
    `/#/super/accounts/${project.accountId}/projects/${project.id}` :
    `/#/projects/${project.id}`;
  
  return new SplitButtonModel({
    text: 'View Project',
    type: buttonTypes.link,
    href: baseUrl,
    buttonClasses: 'btn-primary btn-sm',
    dropDownItems: [
      { text: 'Events', href: baseUrl },
      { text: 'Users', href: `${baseUrl}/users` },
      { text: 'Groups', href: `${baseUrl}/groups` },
      { text: 'Media', href: `${baseUrl}/media-gallery` },
      { text: 'Reports', href: `${baseUrl}/reports` },
      { text: 'Settings', href: `${baseUrl}/settings` },
    ],
  });
}
