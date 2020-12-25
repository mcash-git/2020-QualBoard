import moment from 'moment-timezone';
import { ListCardModel } from 'shared/components/list-card-model';
import { SplitButtonModel, buttonTypes } from 'shared/components/split-button-model';
import { enums } from '2020-qb4';

const EventTypes = enums.eventTypes;
const dateFormat = 'M/D/YYYY h:mm A';

export class EventCardModel extends ListCardModel {
  constructor(event = {}, accountId) {
    const {
      closeTime = null,
      eventParticipantCount = null,
      openTime = null,
      past24HourResponseCount = null,
      past48HourResponseCount = null,
      privateName = null,
      publicName = null,
      timeZone = null,
      totalResponseCount = null,
    } = event;

    const openMoment = moment.tz(openTime, timeZone);
    const closeMoment = moment.tz(closeTime, timeZone);

    super({
      title: publicName,
      subtitle: `(${privateName})`,
      iconClass: 'icon-noun_640064',
      detailItems: [{
        label: 'Schedule',
        iconClass: `icon-schedule ${getScheduleIconClass(event)}`,
        expandContent: {
          viewModel: 'researcher/project/events/event-card-expand-content-schedule',
          open: openMoment.format(dateFormat),
          close: moment.tz(closeTime, timeZone).format(dateFormat),
          timeZone: moment.tz.zone(timeZone).abbr(closeMoment.valueOf()),
        },
      }, {
        label: 'Posts',
        value: totalResponseCount,
        expandContent: {
          viewModel: 'researcher/project/events/event-card-expand-content-post-stats',
          last24: past24HourResponseCount,
          last48: past48HourResponseCount,
        },
      },
      { label: 'Participants', value: eventParticipantCount },
      ],
      button: buildButtonModel(event, accountId),
    });
    this.event = event;
  }
}

function buildButtonModel(event, accountId) {
  const baseUrl = accountId ?
    `/#/super/accounts/${accountId}/projects/${event.projectId}/${typeToUrlFragment(event.type)}/${event.id}` :
    `/#/projects/${event.projectId}/${typeToUrlFragment(event.type)}/${event.id}`;

  return new SplitButtonModel({
    text: 'View Event',
    type: buttonTypes.link,
    href: baseUrl,
    buttonClasses: 'btn-primary btn-sm',
    dropDownItems: [
      { text: 'Responses', href: baseUrl },
      { text: 'Edit', href: `${baseUrl}/edit` },
      { text: 'Users', href: `${baseUrl}/users` },
      { text: 'Settings', href: `${baseUrl}/settings` },
    ],
  });
}

function typeToUrlFragment(type) {
  switch (EventTypes[type]) {
    case EventTypes.individualActivity:
      return 'individual-activities';
    default:
      throw new Error('Only individual activities are currently supported.');
  }
}

// TODO:  refactor - this logic exists in multiple places now, but I don't want to stop right now
// to do the refactor.  So later.  (ie - where are we now, in respect to [some date range]?)
function getScheduleIconClass(event) {
  if (!event.isActive) {
    return 'inactive';
  }

  const now = moment();
  const opensOn = moment(event.openTime);
  const closesOn = moment(event.closeTime);

  const openComparison = now.diff(opensOn);

  if (openComparison < 0) {
    return 'pending';
  }

  const closeComparison = now.diff(closesOn);

  if (openComparison >= 0 && closeComparison < 0) {
    return 'open';
  } else if (closeComparison >= 0) {
    return 'closed';
  }

  throw new Error('Unexpected state - comparison resulted in an event that\'s not pending / ' +
    'open / closed');
}
