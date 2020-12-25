import { actions } from 'researcher/state/all-actions';
import updateGroupTag from 'researcher/state/group-tags/reducers/update-group-tag';
import groupTagDtos from 'dtos/group-tags.json';
import groupTagDto from 'dtos/group-tag.json';

const projectId = 'project';
const otherProjectId = 'some-other-project';

describe('reducer: updateGroupTag()', () => {
  let state;
  let groupTag;
  let groupTags;
  let action;
  let resultState;

  describe('groupTags for provided project ID are not in state', () => {
    beforeEach(() => {
      state = {
        [otherProjectId]: {
          tags: groupTagDtos,
        },
      };
      groupTag = groupTagDto;
      action = actions.groupTags.update({ projectId, tag: groupTag });
      action.payload.projectId = projectId;
      resultState = updateGroupTag(state, action);
    });

    it('returns state unchanged', () => {
      expect(resultState).toBe(state);
    });
  });

  describe('groupTags for provided project ID are in state', () => {
    beforeEach(() => {
      groupTags = groupTagDtos;
      state = {
        [projectId]: {
          tags: groupTags,
        },
      };
    });

    describe('groupTag is present', () => {
      let color;
      beforeEach(() => {
        color = 'hahaha';
        groupTag = {
          ...groupTags[0],
          color,
        };
        action = actions.groupTags.update({ projectId, tag: groupTag });
        action.payload.projectId = projectId;
        resultState = updateGroupTag(state, action);
      });

      it('UPDATES the groupTag', () => {
        expect(resultState[projectId]).toBeDefined();
        expect(resultState[projectId].tags).toBeDefined();
        expect(resultState[projectId].tags).toHaveLength(groupTagDtos.length);
        expect(resultState[projectId].tags.find((a) => a.id === groupTag.id)).toBeDefined();
        expect(resultState[projectId].tags.find((a) => a.id === groupTag.id).color).toBe(color);
      });

      it('does not mutate state', () => {
        expect(resultState).not.toBe(state);
        expect(resultState[projectId]).not.toBe(state[projectId]);
        expect(resultState[projectId].tags).not.toBe(state[projectId].tags);
      });
    });

    describe('groupTag is not present', () => {
      beforeEach(() => {
        groupTag = groupTagDto;
        action = actions.groupTags.update({ projectId, tag: groupTag });
        action.payload.projectId = projectId;
      });

      it('throws an error', () => {
        expect(() => updateGroupTag(state, action)).toThrow(/found/);
      });
    });
  });
});
