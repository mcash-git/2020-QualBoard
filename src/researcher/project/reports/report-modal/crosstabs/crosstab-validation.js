import { ValidationRule } from '2020-aurelia';

export class CrosstabValidation {
  constructor() {
    this.report = {};
  }

  registerRules(validator) {
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

    return validator;
  }
}
