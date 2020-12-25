import { growlProvider } from 'shared/growl-provider';

export const GroupTagValidation = {
  tagNameIsValid: (newTagName, allTags) => {
    if (!newTagName || newTagName.trim() === '') {
      errorValidationGrowl('No group tag name provided.');
      return false;
    }
    if (isDuplicateTag(newTagName, allTags)) {
      errorValidationGrowl('Duplicate group tag name found.');
      return false;
    }
    if (tagContainsComma(newTagName)) {
      errorValidationGrowl('Group tag may not contain a comma.');
      return false;
    }

    growlProvider.removeValidationGrowls();
    return true;
  },
};

function errorValidationGrowl(msg) {
  growlProvider.error('Error', msg, { class: 'validation-error' });
}

function isDuplicateTag(tag, allTags) {
  const lower = tag.toLowerCase().trim();
  return allTags.some(t => t.tagLower === lower);
}

function tagContainsComma(tag) {
  return tag.indexOf(',') > -1;
}
