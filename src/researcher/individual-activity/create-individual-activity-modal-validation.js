import { ValidationRule } from '2020-aurelia';
import { DateTimePickerModel } from 'shared/models/date-time-picker-model';
import moment from 'moment';
import * as validate from 'validator';
import { isRepeatUnitRepeating } from 'shared/utility/is-repeat-unit-repeating';

const posInt = value => validate.isInt(value, { min: 1 });

export const rules = [

  new ValidationRule({
    property: 'createCommand.publicName',
    validate: value => value,
    message: 'Please include a public name.',
  }),

  new ValidationRule({
    property: 'createCommand.privateName',
    validate: value => value,
    message: 'Please include a private name.',
  }),

  new ValidationRule({
    property: 'createCommand.timeZone',
    validate: value => value,
    message: 'Please select a time zone.',
  }),

  new ValidationRule({
    property: 'createCommand.open.date',
    validate: value => value,
    message: 'Please include an open date.',
  }),
  new ValidationRule({
    property: 'createCommand.open.date',
    validate: value => moment(value, DateTimePickerModel.dateFormat)
      .isValid(),
    runIf: value => value,
    message: 'Please specify a valid open date.',
  }),

  new ValidationRule({
    property: 'createCommand.open.time',
    validate: value => value,
    message: 'Please include an open time.',
  }),
  new ValidationRule({
    property: 'createCommand.open.time',
    validate: value => moment(value, DateTimePickerModel.timeFormat)
      .isValid(),
    runIf: value => value,
    message: 'Please specify a valid open time.',
  }),

  new ValidationRule({
    property: 'createCommand.close.date',
    validate: value => value,
    runIf: (value, model) => !isRepeatUnitRepeating(model.createCommand.repeatUnit),
    message: 'Please include a close date.',
  }),
  new ValidationRule({
    property: 'createCommand.close.date',
    validate: value => moment(value, DateTimePickerModel.dateFormat)
      .isValid(),
    runIf: (value, model) => !isRepeatUnitRepeating(model.createCommand.repeatUnit) &&
      value,
    message: 'Please specify a valid close date.',
  }),
  new ValidationRule({
    property: 'createCommand.close.date',
    validate: (value, model) => validate
      .isAfter(value, model.createCommand.open.date) ||
        !validate.isBefore(value, model.createCommand.open.date),
    runIf: (value, model) => !isRepeatUnitRepeating(model.createCommand.repeatUnit) &&
      value &&
      model.createCommand.open.date &&
      moment(value, DateTimePickerModel.dateFormat).isValid(),
    message: 'Close date must be on or after open date.',
  }),

  new ValidationRule({
    property: 'createCommand.close.time',
    validate: value => value,
    runIf: (value, model) => !isRepeatUnitRepeating(model.createCommand.repeatUnit),
    message: 'Please include an close time.',
  }),
  new ValidationRule({
    property: 'createCommand.close.time',
    validate: value => moment(value, DateTimePickerModel.timeFormat)
      .isValid(),
    runIf: (value, model) => !isRepeatUnitRepeating(model.createCommand.repeatUnit) && value,
    message: 'Please specify a valid close time.',
  }),
  new ValidationRule({
    property: 'createCommand.close.time',
    validate: (value, model) => moment(model.createCommand.close.dateTimeText)
      .isAfter(moment(model.createCommand.open.dateTimeText)),
    runIf: (value, model) => !isRepeatUnitRepeating(model.createCommand.repeatUnit) &&
      value &&
      model.createCommand.open.dateMoment.isValid() &&
      model.createCommand.open.timeMoment.isValid() &&
      model.createCommand.close.dateMoment.isValid() &&
      model.createCommand.close.timeMoment.isValid() &&
      moment(model.createCommand.close.date).isSame(moment(model.createCommand.open.date)),
    message: 'Close time must be after open time.',
  }),

  new ValidationRule({
    property: 'createCommand.numberOfRepetitions',
    validate: value => value,
    runIf: (value, model) => isRepeatUnitRepeating(model.createCommand.repeatUnit),
    message: 'Please specify the total number of repetitions.',
  }),
  new ValidationRule({
    property: 'createCommand.numberOfRepetitions',
    validate: posInt,
    runIf: (value, model) => isRepeatUnitRepeating(model.createCommand.repeatUnit) && value,
    message: 'Please enter a valid number of repetitions',
  }),

  new ValidationRule({
    property: 'createCommand.repeatMinimum',
    validate: value => value,
    runIf: (value, model) => model.createCommand.repeatUnit.value !== 'None',
    message: 'Please specify the minimum number of completions.',
  }),
  new ValidationRule({
    property: 'createCommand.repeatMinimum',
    validate: posInt,
    runIf: (value, model) => model.createCommand.repeatUnit.value !== 'None' && value,
    message: 'Please enter a valid minimum number of completions.',
  }),

  new ValidationRule({
    property: 'createCommand.repeatMaximum',
    validate: posInt,
    runIf: (value, model) => model.createCommand.repeatUnit.value !== 'None' && value,
    message: 'Please enter a valid maximum number of completions.',
  }),
  new ValidationRule({
    property: 'createCommand.repeatMaximum',
    validate: (value, model) => parseInt(value, 10) >=
    parseInt(model.createCommand.repeatMinimum, 10),
    runIf: (value, model) => model.createCommand.repeatUnit.value !== 'None' &&
      value &&
      posInt(value) &&
      model.createCommand.repeatMinimum &&
      posInt(model.createCommand.repeatMinimum),
    message: 'Maximum number of completions must be greater than or equal to the minimum specified.',
  }),
];
