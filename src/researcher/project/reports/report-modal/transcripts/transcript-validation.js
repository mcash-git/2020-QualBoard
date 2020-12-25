import { ValidationRule } from '2020-aurelia';
import * as validate from 'validator';
import moment from 'moment';

export class TranscriptValidation {
  constructor() {
    this.report = {};
  }

  registerRules(validator) {
    const valueFormat = 'YYYY-MM-DD';

    validator.registerRule(new ValidationRule({
      property: 'report.name',
      validate: value => value,
      message: 'Please enter a report name',
    }));

    validator.registerRule(new ValidationRule({
      property: 'report.events',
      validate: value => value.length > 0,
      message: 'Please select one or more activities',
    }));

    validator.registerRule(new ValidationRule({
      property: 'report.startOn',
      validate: value => moment(value, valueFormat).isValid(),
      message: 'Please specify a valid start date.',
      runIf: value => value,
    }));

    validator.registerRule(new ValidationRule({
      property: 'report.endOn',
      validate: value => moment(value, valueFormat).isValid(),
      runIf: value => value,
      message: 'Please specify a valid end date.',
    }));

    validator.registerRule(new ValidationRule({
      property: 'report.endOn',
      validate: (value, model) => validate
        .isAfter(value, model.report.startOn) ||
        !validate.isBefore(value, model.report.startOn),
      runIf: (value, model) => value && model.report.startOn &&
        moment(model.report.endOn, valueFormat).isValid(),
      message: 'Please specify a valid date range (start must come after end.)',
    }));
    return validator;
  }
}
