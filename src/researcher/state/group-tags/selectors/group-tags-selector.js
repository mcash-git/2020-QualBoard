import { createSelector } from 'reselect';
import { GroupTagModel } from 'researcher/models/group-tag-model';

export default createSelector(
  (state) => state.project.id,
  (state) => state.groupTags,
  (projectId, allGroupTagsState) => {
    const groupTagsState = allGroupTagsState[projectId];
    const tags = groupTagsState && groupTagsState.tags;
    return tags && tags.map(tag => GroupTagModel.fromDto(tag));
  },
);
