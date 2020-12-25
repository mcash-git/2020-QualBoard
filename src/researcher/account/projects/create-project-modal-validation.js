import { ValidationRule } from '2020-aurelia';
import { DateTimePickerModel } from 'shared/models/date-time-picker-model';
import moment from 'moment';
import * as validate from 'validator';

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
    runIf: (value, model) => model.repeatCategory !== 'Repeating',
    message: 'Please include an close date.',
  }),
  new ValidationRule({
    property: 'createCommand.close.date',
    validate: value => moment(value, DateTimePickerModel.timeFormat)
      .isValid(),
    runIf: (value, model) => model.repeatCategory !== 'Repeating' && value,
    message: 'Please specify a valid close date.',
  }),
  new ValidationRule({
    property: 'createCommand.close.date',
    validate: (value, model) => validate
      .isAfter(value, model.createCommand.open.date) ||
    !validate.isBefore(value, model.createCommand.open.date),
    runIf: (value, model) => model.repeatCategory !== 'Repeating' && value
    && model.createCommand.open.date &&
    moment(value, DateTimePickerModel.timeFormat).isValid(),
    message: 'Close date must be on or after open date.',
  }),

  new ValidationRule({
    property: 'createCommand.close.time',
    validate: value => value,
    runIf: (value, model) => model.repeatCategory !== 'Repeating',
    message: 'Please include an close time.',
  }),
  new ValidationRule({
    property: 'createCommand.close.time',
    validate: value => moment(value, DateTimePickerModel.timeFormat)
      .isValid(),
    runIf: (value, model) => model.repeatCategory !== 'Repeating' && value,
    message: 'Please specify a valid close time.',
  }),
  new ValidationRule({
    property: 'createCommand.close.time',
    validate: (value, model) => moment(model.createCommand.close.dateTimeText)
      .isAfter(moment(model.createCommand.open.dateTimeText)),
    runIf: (value, model) => model.repeatCategory !== 'Repeating' && value &&
    model.createCommand.open.dateMoment.isValid() &&
    model.createCommand.open.timeMoment.isValid() &&
    model.createCommand.close.dateMoment.isValid() &&
    model.createCommand.close.timeMoment.isValid() &&
    moment(model.createCommand.close.date)
      .isSame(moment(model.createCommand.open.date)),
    message: 'Close time must be after open time.',
  }),
];
