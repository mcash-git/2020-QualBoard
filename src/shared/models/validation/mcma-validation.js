import { ValidationRule, CollectionValidationRule } from '2020-aurelia';
import { enums } from '2020-qb4';

const PromptTypes = enums.promptTypes;
const hasValue = value => value && value.trim();
const isMcma = (value, model) =>
  PromptTypes[model.type].value.startsWith('Multiple');

export const rules = [

  new ValidationRule({
    property: 'options',
    validate: value => value && value.length > 1,
    message: 'Please include at least 2 options.',
    runIf: isMcma,
  }),

  new CollectionValidationRule({
    property: 'options',
    collectionProperty: 'text',
    validate: hasValue,
    message: 'Please include some text for the option',
    runIf: (value, item, collection, model) => isMcma(value, model),
    itemName: 'option',
  }),
  new CollectionValidationRule({
    property: 'options',
    collectionProperty: 'text',
    validate: (value, item, collection) => collection.filter(opt => opt.text &&
      opt.text.trim().toLowerCase() === value.trim().toLowerCase())
      .length === 1,
    runIf: (value, item, collection, model) => isMcma(value, model) &&
     hasValue(value),
    message: 'You cannot have duplicated options',
    itemName: 'option',
  }),
];
