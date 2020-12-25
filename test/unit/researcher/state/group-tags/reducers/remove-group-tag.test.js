import { actions } from 'researcher/state/all-actions';
import removeGroupTag from 'researcher/state/group-tags/reducers/remove-group-tag';
import groupTagDtos from 'dtos/group-tags.json';
import groupTagDto from 'dtos/group-tag.json';

const projectId = 'project';
const otherProjectId = 'some-other-project';

describe('reducer: removeGroupTag()', () => {
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
      action = actions.groupTags.remove({ projectId, id: groupTag.id });
      action.payload.projectId = projectId;
      resultState = removeGroupTag(state, action);
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
          tags: groupTagDtos,
        },
      };
    });

    describe('groupTag is present', () => {
      beforeEach(() => {
        groupTag = groupTags[0];
        action = actions.groupTags.remove({ projectId, id: groupTag.id });
        action.payload.projectId = projectId;
        resultState = removeGroupTag(state, action);
      });

      it('removes the groupTag', () => {
        expect(resultState[projectId]).toBeDefined();
        expect(resultState[projectId].tags).toBeDefined();
        expect(resultState[projectId].tags).toHaveLength(groupTagDtos.length - 1);
        expect(resultState[projectId].tags.find((a) => a.id === groupTag.id)).not.toBeDefined();
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
        action = actions.groupTags.remove({ projectId, id: groupTag.id });
        action.payload.projectId = projectId;
      });

      it('throws an error', () => {
        expect(() => removeGroupTag(state, action)).toThrow(/found/);
      });
    });
  });
});
