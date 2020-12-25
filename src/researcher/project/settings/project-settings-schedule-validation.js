import { ValidationRule } from '2020-aurelia';
import { DateTimePickerModel } from 'shared/models/date-time-picker-model';
import moment from 'moment';
import * as validate from 'validator';

export const rules = [

  new ValidationRule({
    property: 'edit.timeZone',
    validate: value => value,
    message: 'Please select a time zone.',
  }),

  new ValidationRule({
    property: 'edit.open.date',
    validate: value => value,
    message: 'Please include an open date.',
  }),
  new ValidationRule({
    property: 'edit.open.date',
    validate: value => moment(value, DateTimePickerModel.dateFormat)
      .isValid(),
    runIf: value => value,
    message: 'Please specify a valid open date.',
  }),

  new ValidationRule({
    property: 'edit.open.time',
    validate: value => value,
    message: 'Please include an open time.',
  }),
  new ValidationRule({
    property: 'edit.open.time',
    validate: value => moment(value, DateTimePickerModel.timeFormat)
      .isValid(),
    runIf: value => value,
    message: 'Please specify a valid open time.',
  }),

  new ValidationRule({
    property: 'edit.close.date',
    validate: value => value,
    runIf: (value, model) => model.repeatCategory !== 'Repeating',
    message: 'Please include an close date.',
  }),
  new ValidationRule({
    property: 'edit.close.date',
    validate: value => moment(value, DateTimePickerModel.dateFormat)
      .isValid(),
    runIf: (value, model) => model.repeatCategory !== 'Repeating' && value,
    message: 'Please specify a valid close date.',
  }),
  new ValidationRule({
    property: 'edit.close.date',
    validate: (value, model) => validate
      .isAfter(value, model.edit.open.date) ||
    !validate.isBefore(value, model.edit.open.date),
    runIf: (value, model) => model.repeatCategory !== 'Repeating' && value
    && model.edit.open.date &&
      moment(value, DateTimePickerModel.dateFormat).isValid(),
    message: 'Close date must be on or after open date.',
  }),

  new ValidationRule({
    property: 'edit.close.time',
    validate: value => value,
    runIf: (value, model) => model.repeatCategory !== 'Repeating',
    message: 'Please include an close time.',
  }),
  new ValidationRule({
    property: 'edit.close.time',
    validate: value => moment(value, DateTimePickerModel.timeFormat)
      .isValid(),
    runIf: (value, model) => model.repeatCategory !== 'Repeating' && value,
    message: 'Please specify a valid close time.',
  }),
  new ValidationRule({
    property: 'edit.close.time',
    validate: (value, model) => moment(model.edit.close.dateTimeText)
      .isAfter(moment(model.edit.open.dateTimeText)),
    runIf: (value, model) => model.repeatCategory !== 'Repeating' && value &&
    model.edit.open.dateMoment.isValid() &&
    model.edit.open.timeMoment.isValid() &&
    model.edit.close.dateMoment.isValid() &&
    model.edit.close.timeMoment.isValid() &&
    moment(model.edit.close.date)
      .isSame(moment(model.edit.open.date)),
    message: 'Close time must be after open time.',
  }),
];
