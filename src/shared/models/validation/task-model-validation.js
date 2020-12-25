import { ValidationRule } from '2020-aurelia';
import { rules as mcmaRules } from './mcma-validation';
import { rules as multipleAnswerRules } from './multiple-answer-task-validation';
import { rules as matrixRules } from './matrix-validation';

export const rules = [

  new ValidationRule({
    property: 'title',
    validate: value => value,
    message: 'Please include a title for your task.',
  }),

  new ValidationRule({
    property: 'text',
    validate: value => value,
    message: 'Please include some text for your task.',
  }),

  ...mcmaRules,
  ...multipleAnswerRules,
  ...matrixRules,
];
