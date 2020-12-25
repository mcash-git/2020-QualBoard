// NOTE:  Technical debt; this really needs to live in a separate library.  This
// code is currently duplicated in 2020-admin, so if any changes are warranted, we
// need to either keep maintaining two copies or go ahead and break it out.
import sanitizeHtml from 'sanitize-html';

const defaultAllowedTags = [
  ...sanitizeHtml.defaults.allowedTags,
  'h1',
  'h2',
  'u',
];

const defaultAllowedAttributes = {
  ...sanitizeHtml.defaults.allowedAttributes,
  '*': ['style', 'class'],
};

export default function sanitizeUserHtml(userHtml, {
  onlyTags, // completely override - do not use the default allowed tags
  moreTags, // add allowed tags to the defaults
  lessTags, // remove allowed tags from the defaults
  onlyAttributes, // completely override - do not use the default attributes
  moreAttributes, // add allowed tags to the defaults
  lessAttributes, // remove allowed tags from the defaults
} = {}) {
  if (!userHtml) {
    return userHtml;
  }

  const allowedAttributes =
    determineAttributes(onlyAttributes, moreAttributes, lessAttributes);
  const allowedTags =
    determineTags(onlyTags, moreTags, lessTags);

  return sanitizeHtml(userHtml, {
    allowedTags,
    allowedAttributes,
  });
}

function determineAttributes(onlyAttributes, moreAttributes = {}, lessAttributes = {}) {
  if (onlyAttributes) {
    return onlyAttributes;
  }

  const allowedAttributes = {
    ...defaultAllowedAttributes,
  };

  Object.keys(moreAttributes).forEach((tag) => {
    const addAttributes = moreAttributes[tag].map((t) => t.toLowerCase());
    const allowedAttributesForTag = allowedAttributes[tag] &&
      allowedAttributes[tag].map((t) => t.toLowerCase());
    if (!allowedAttributesForTag) {
      allowedAttributes[tag] = addAttributes;
      return;
    }
    allowedAttributes[tag] = [...allowedAttributesForTag, ...addAttributes];
  });

  Object.keys(lessAttributes).forEach((tag) => {
    const removeAttributes = lessAttributes[tag].map((t) => t.toLowerCase());
    const allowedAttributesForTag = allowedAttributes[tag] &&
      allowedAttributes[tag].map((t) => t.toLowerCase());
    if (!allowedAttributesForTag) {
      return;
    }

    allowedAttributes[tag] = allowedAttributesForTag
      .filter((aa) => removeAttributes.every((ra) => aa !== ra));
  });

  return allowedAttributes;
}

function determineTags(onlyTags, moreTags = [], lessTags = []) {
  if (onlyTags) {
    return onlyTags;
  }

  return [
    ...defaultAllowedTags,
    ...moreTags,
  ].filter((at) => lessTags
    .findIndex((lt) => lt.toLowerCase() === at.toLowerCase()) === -1);
}
