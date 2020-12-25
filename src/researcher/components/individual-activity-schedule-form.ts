import { bindable, observable, computedFrom, bindingMode } from 'aurelia-framework';
import getDurationInDays from 'shared/utility/get-duration-in-days';
import { enums } from '2020-qb4';
import { isRepeatUnitRepeating } from 'shared/utility/is-repeat-unit-repeating';

const RepeatUnits = enums.repeatUnits;

declare const $:any;

export class IndividualActivityScheduleForm {
  constructor() {
    this.repeatUnits = RepeatUnits;
  }

  @bindable totalResponseCount;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) open;
  @bindable openDateProperty;
  @bindable openTimeProperty;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) close;
  @bindable closeDateProperty;
  @bindable closeTimeProperty;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) timeZone;
  @bindable timeZoneProperty;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) repeatUnit;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) repeatMinimum;
  @bindable repeatMinimumProperty;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) repeatMaximum;
  @bindable repeatMaximumProperty;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) numberOfRepetitions;
  @bindable numberOfRepetitionsProperty;
  @bindable shouldShowDurationSummary = true;
  @bindable validator;

  @observable repeatingRepeatUnit = RepeatUnits.daily;
  @observable repeatCategory = null;

  repeatUnits:any[];

  repeatCategories:any = {
    none: 'None',
    repeating: 'Repeating',
    continuous: 'Continuous',
  };

  bind() {
    if (this.repeatUnit) {
      // for binding easiness:
      this.repeatUnitChanged();
      switch (this.repeatUnit.value) {
        case 'None':
          this.repeatCategory = this.repeatCategories.none;
          break;
        case 'Continuous':
          this.repeatCategory = this.repeatCategories.continuous;
          break;
        case 'Daily':
        case 'Weekly':
        case 'Monthly':
          this.repeatingRepeatUnit = this.repeatUnit;
          this.repeatCategory = this.repeatCategories.repeating;
          break;
        default:
          throw new Error('Unrecognized repeat unit');
      }
    }
  }

  repeatUnitChanged() {
    let index = RepeatUnits.indexOf(this.repeatUnit);
    if (index === -1) {
      index = this.repeatUnits.findIndex(ru => ru.value === this.repeatUnit.value);
      this.repeatUnits.splice(index, 1, this.repeatUnit);
    }
  }

  repeatingRepeatUnitChanged() {
    this.updateRepeatUnit();
  }

  repeatCategoryChanged(newValue, oldValue) {
    if (oldValue === undefined) {
      return;
    }

    if (oldValue !== null) {
      $(this[`schedule${oldValue}Element`]).collapse('hide');
    }

    if (newValue !== null) {
      $(this[`schedule${newValue}Element`]).collapse('show');
    }

    this.updateRepeatUnit();
  }

  updateRepeatUnit() {
    if (!this.repeatCategory || !this.repeatCategories) {
      return;
    }

    switch (this.repeatCategory) {
      case this.repeatCategories.none:
        this.repeatUnit = RepeatUnits.none;
        break;
      case this.repeatCategories.repeating:
        this.repeatUnit = this.repeatingRepeatUnit;
        break;
      case this.repeatCategories.continuous:
        this.repeatUnit = RepeatUnits.continuous;
        break;
      default:
        throw new Error('Unknown repeat category.');
    }
  }

  reset() {
    this.bind();
  }

  _getRepeatUnit() {
    return RepeatUnits.find(u => u.value === this.repeatCategory) || this.repeatUnit;
  }

  @computedFrom(
    'open.dateTimeText',
    'close.dateTimeText',
    'repeatUnit',
    'repeatCategory',
    'numberOfRepetitions',
  )
  get duration() {
    const durationInDays =
      getDurationInDays(this, this._getRepeatUnit(), this.numberOfRepetitions);

    return `${durationInDays} day${durationInDays === 1 ? '' : 's'}`;
  }
}

export class OnlyRepeatingValueConverter {
  toView(repeatUnits) {
    return repeatUnits.slice(2, repeatUnits.length);
  }
}
