import { actions } from 'researcher/state/all-actions';
import addGroupTags from 'researcher/state/group-tags/reducers/add-group-tags';
import groupTags from 'dtos/group-tags.json';

const addingTags = [{
  id: 'group-tag-5',
  projectId: 'project',
  name: 'fidget spinners r ded',
  color: '#badfad',
}, {
  id: 'group-tag-6',
  projectId: 'project',
  name: 'call the banners and strike',
  color: '#badfad',
}];

const projectId = 'project';
const otherProjectId = 'some-other-project';

describe('reducer: addGroupTag()', () => {
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
      action = actions.groupTags.addMultiple({ projectId, tags: addingTags });
      resultState = addGroupTags(state, action);
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
      action = actions.groupTags.addMultiple({ projectId, tags: addingTags });
      resultState = addGroupTags(state, action);
    });

    it('adds the group tag', () => {
      expect(resultState[projectId]).toBeDefined();
      expect(resultState[projectId].tags).toBeDefined();
      expect(resultState[projectId].tags).toHaveLength(groupTags.length + addingTags.length);
    });

    it('does not mutate state', () => {
      expect(resultState).not.toBe(state);
      expect(resultState[projectId]).not.toBe(state[projectId]);
      expect(resultState[projectId].tags).not.toBe(state[projectId].tags);
    });
  });
});
