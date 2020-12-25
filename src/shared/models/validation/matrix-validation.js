import { ValidationRule, CollectionValidationRule } from '2020-aurelia';
import { enums } from '2020-qb4';

const PromptTypes = enums.promptTypes;
const hasValue = value => value && (`${value}`).trim();

// Worth noting that these rules apply to multiple answer AND matrix multiple
// answer
const isMatrix = (value, model) =>
  PromptTypes[model.type].value.startsWith('Matrix');
export const rules = [

  new ValidationRule({
    property: 'matrixColumns',
    validate: value => value && value.length > 1,
    message: 'Please include at least 2 columns for your task.',
    runIf: isMatrix,
  }),

  new CollectionValidationRule({
    property: 'matrixColumns',
    collectionProperty: 'text',
    validate: hasValue,
    message: 'Please include some text for the column',
    runIf: (value, item, collection, model) => isMatrix(value, model),
    itemName: 'column',
  }),
  new CollectionValidationRule({
    property: 'matrixColumns',
    collectionProperty: 'text',
    validate: (value, item, collection) => collection.filter(opt => opt.text &&
    opt.text.trim().toLowerCase() === value.trim().toLowerCase())
      .length === 1,
    runIf: (value, item, collection, model) => isMatrix(value, model) &&
    hasValue(value),
    message: 'You cannot have duplicated columns',
    itemName: 'column',
  }),

  new ValidationRule({
    property: 'matrixRows',
    validate: value => value && value.length > 0,
    message: 'Please include at least 1 row for your task.',
    runIf: isMatrix,
  }),

  new CollectionValidationRule({
    property: 'matrixRows',
    collectionProperty: 'text',
    validate: hasValue,
    message: 'Please include some text for the row',
    runIf: (value, item, collection, model) => isMatrix(value, model),
    itemName: 'row',
  }),
  new CollectionValidationRule({
    property: 'matrixRows',
    collectionProperty: 'text',
    validate: (value, item, collection) => collection.filter(opt => opt.text &&
    opt.text.trim().toLowerCase() === value.trim().toLowerCase())
      .length === 1,
    runIf: (value, item, collection, model) => isMatrix(value, model) &&
    hasValue(value),
    message: 'You cannot have duplicated rows',
    itemName: 'row',
  }),
];
