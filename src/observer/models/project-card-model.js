import moment from 'moment-timezone';
import { ButtonModel, buttonTypes } from 'shared/components/button-model';

const dateFormat = 'M/D/YYYY h:mm A';

export class ProjectCardModel {
  constructor(project = {}) {
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
    
    this.button = buildButtonModel(project);
  }
}

function buildButtonModel(project) {
  return new ButtonModel({
    text: 'View Project',
    type: buttonTypes.link,
    href: `/#/observer/projects/${project.id}`,
    buttonClasses: 'btn-primary btn-sm',
  });
}
