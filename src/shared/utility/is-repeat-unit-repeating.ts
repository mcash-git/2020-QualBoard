import { enums } from '2020-qb4';

const RepeatUnits = enums.repeatUnits;

export function isRepeatUnitRepeating(repeatUnit:any) : boolean {
  switch(repeatUnit.value) {
    case RepeatUnits.daily.value:
    case RepeatUnits.weekly.value:
    case RepeatUnits.monthly.value:
      return true;
    default:
      return false;
  }
}
