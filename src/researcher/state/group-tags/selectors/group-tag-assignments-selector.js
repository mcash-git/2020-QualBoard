import { createSelector } from 'reselect';
import { enums } from '2020-qb4';
import groupTagsSelector from './group-tags-selector';
import projectUsersSelector from '../../project-users/selectors/project-users-selector';
import { GroupTagModel } from '../../../models/group-tag-model';

const ProjectRoles = enums.projectRoles;

export default createSelector(
  projectUsersSelector,
  groupTagsSelector,
  (projectUsers, groupTags) => {
    if (!projectUsers || !groupTags) {
      return null;
    }
    const assignments = new Map(groupTags.map((gt) => [gt.id, new GroupTagModel({
      ...gt,
      participants: [],
    })]));
    projectUsers
      .filter((pu) => pu.role.value === ProjectRoles.participant.value)
      .forEach((p) => p.groupTags.forEach(gt => { assignments.get(gt.id).participants.push(p); }));
    return Array.from(assignments.values());
  },
);
