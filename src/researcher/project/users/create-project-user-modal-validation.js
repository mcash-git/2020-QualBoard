import { ValidationRule } from '2020-aurelia';
import * as validate from 'validator';

export const rules = [
  new ValidationRule({
    property: 'role',
    validate: value => value,
    message: 'Please select a project user type.',
  }),

  new ValidationRule({
    property: 'createCommand.email',
    validate: value => value,
    message: 'Please include an email address for the user.',
  }),
  new ValidationRule({
    property: 'createCommand.email',
    validate: value => validate.isEmail(value),
    runIf: value => value,
    message: 'Email address is invalid.',
  }),

  new ValidationRule({
    property: 'userProject.displayName',
    validate: value => value,
    message: 'Please include a display name for the user.',
  }),
];
