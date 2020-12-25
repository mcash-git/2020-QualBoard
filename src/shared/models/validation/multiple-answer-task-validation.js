import { ValidationRule } from '2020-aurelia';
import * as validate from 'validator';
import { enums } from '2020-qb4';

const PromptTypes = enums.promptTypes;
const posInt = value => validate.isInt(`${value}`, { min: 1 });
const hasValue = value => value && (`${value}`).trim();

// Worth noting that these rules apply to multiple answer AND matrix multiple
// answer
const isMaOrMma = (value, model) =>
  PromptTypes[model.type].value.endsWith('MultipleAnswer');
const isMultipleAnswer = (value, model) =>
  PromptTypes[model.type].value === 'MultipleAnswer';
const isMatrixMultipleAnswer = (value, model) =>
  PromptTypes[model.type].value === 'MatrixMultipleAnswer';
export const rules = [

  new ValidationRule({
    property: 'minimumOptionsRequired',
    validate: hasValue,
    message: 'Please specify a value for the minimum required options',
    runIf: isMaOrMma,
  }),
  new ValidationRule({
    property: 'minimumOptionsRequired',
    validate: posInt,
    message: 'Please specify a valid number greater than zero for option min',
    runIf: (value, model) => isMaOrMma(value, model) && hasValue(value),
  }),
  new ValidationRule({
    property: 'minimumOptionsRequired',
    validate: (value, model) => value < model.options.length,
    message: 'Minimum required options must be less than the total number of available options',
    runIf: isMultipleAnswer,
  }),
  new ValidationRule({
    property: 'minimumOptionsRequired',
    validate: (value, model) => value < model.matrixColumns.length,
    message: 'Minimum required options per row must be less than the total number of available columns',
    runIf: isMatrixMultipleAnswer,
  }),

  new ValidationRule({
    property: 'maximumOptionsLimit',
    validate: posInt,
    message: 'Please specify a valid number greater than zero for option max',
    runIf: (value, model) => isMaOrMma(value, model) && hasValue(value),
  }),
  new ValidationRule({
    property: 'maximumOptionsLimit',
    validate: (value, model) => value >= model.minimumOptionsRequired,
    message: 'Option max must be greater than or equal to option minimum',
    runIf: (value, model) => isMaOrMma(value, model) &&
    hasValue(value) && hasValue(model.minimumOptionsRequired) &&
    posInt(value) && posInt(model.minimumOptionsRequired),
  }),
];
