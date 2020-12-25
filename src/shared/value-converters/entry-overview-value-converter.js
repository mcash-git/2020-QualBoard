import { enums } from '2020-qb4';

const RepeatUnits = enums.repeatUnits;

const nouns = {
  2: 'Day',
  3: 'Week',
  4: 'Month',
};

const iconMap = {
  0: 'icon-check_circle',
  1: 'icon-ion-close',
  2: 'icon-Activity',
  3: 'icon-Activity',
  4: 'icon-Activity',
};

export class EntryOverviewValueConverter {
  toView(entry = null) {
    if (entry === null) {
      return null;
    }
    const intervalText = entry.repeatUnit.value === RepeatUnits.none.value ||
      entry.repeatUnit.value === RepeatUnits.continuous.value ?
      '' :
      `${nouns[entry.repeatUnit.int]} ${entry.intervalIndex} - `;
    return `${intervalText}Entry ${entry.repetitionIndex}`;
  }
}

export class EntryIconValueConverter {
  toView(value = null) {
    if (value === null) {
      return null;
    }
  
    return iconMap[value.completionStatus.int];
  }
}
