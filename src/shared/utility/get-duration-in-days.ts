import * as moment from 'moment-timezone';
import { enums } from '2020-qb4';
import { isRepeatUnitRepeating } from './is-repeat-unit-repeating';

const RepeatUnits = enums.repeatUnits;

export default function getDurationInDays(
  legacyScheduleObject:any,
  repeatUnit:any,
  numberOfRepetitions:number
  ) : number {
  if (legacyScheduleObject.open.dateTimeText.includes('Invalid') ||
    (legacyScheduleObject.close.dateTimeText.includes('Invalid') &&
      (repeatUnit.value === RepeatUnits.none.value ||
      repeatUnit.value === RepeatUnits.continuous.value))) {
    return 0;
  }

  const open = moment(legacyScheduleObject.open.dateTimeText);
  const close = isRepeatUnitRepeating(repeatUnit) ?
    calculateCloseDate(legacyScheduleObject, repeatUnit, numberOfRepetitions) :
    moment(legacyScheduleObject.close.dateTimeText);

  if (close === null) {
    return 0;
  }

  return Math.ceil(moment.duration(close.diff(open)).asDays());
}

function calculateCloseDate(
  legacyScheduleObject:any, repeatUnit:any, numberOfRepetitions:number) : moment {
  if (repeatUnit.int < 2) {
    return moment(legacyScheduleObject.close.dateTimeText);
  }

  if (!numberOfRepetitions ||
    legacyScheduleObject.open.dateTimeText.includes('Invalid')) {
    return null;
  }

  return moment(legacyScheduleObject.open.dateTimeText)
    .add(numberOfRepetitions, `${repeatUnit.noun.toLowerCase()}s`);
}
