import { createSelector } from 'reselect';
import groupTagsSelector from './group-tags-selector';

export default createSelector(
  groupTagsSelector,
  (groupTags) => groupTags && new Map(groupTags.map(tag => [tag.id, tag])),
);
