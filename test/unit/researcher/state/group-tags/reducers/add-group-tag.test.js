import { actions } from 'researcher/state/all-actions';
import addGroupTag from 'researcher/state/group-tags/reducers/add-group-tag';
import groupTags from 'dtos/group-tags.json';

const groupTag = {
  id: 'group-tag-6',
  projectId: 'project',
  name: 'Wut wut',
  color: '#badfad',
};

const projectId = 'project';
const otherProjectId = 'some-other-project';

describe('reducer: addGroupTags()', () => {
  let state;
  let action;
  let resultState;

  describe('group tags for provided project ID are not in state', () => {
    beforeEach(() => {
      state = {
        [otherProjectId]: {
          tags: groupTags,
        },
      };
      action = actions.groupTags.add({ projectId, tag: groupTag });
      resultState = addGroupTag(state, action);
    });

    it('returns state unchanged', () => {
      expect(resultState).toBe(state);
    });
  });

  describe('group tags for provided project ID are in state', () => {
    beforeEach(() => {
      state = {
        [projectId]: {
          tags: groupTags,
        },
      };
      action = actions.groupTags.add({ projectId, tag: groupTag });
      resultState = addGroupTag(state, action);
    });

    it('adds the group tag', () => {
      expect(resultState[projectId]).toBeDefined();
      expect(resultState[projectId].tags).toBeDefined();
      expect(resultState[projectId].tags).toHaveLength(groupTags.length + 1);
      expect(resultState[projectId].tags.find(t => t.id === groupTag.id)).toBeDefined();
    });

    it('does not mutate state', () => {
      expect(resultState).not.toBe(state);
      expect(resultState[projectId]).not.toBe(state[projectId]);
    });
  });
});
