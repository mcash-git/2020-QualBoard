import { actions } from 'researcher/state/all-actions';
import setGroupTags from 'researcher/state/group-tags/reducers/set-group-tags';
import groupTagDtos from 'dtos/group-tags.json';

const projectId = 'mole-hunter-v-project';
const otherProjectId = 'skim-milk-heroes';

describe('reducer: setGroupTags()', () => {
  let state;
  let groupTags;
  let action;
  let resultState;

  describe('state is empty', () => {
    beforeEach(() => {
      state = {};
      groupTags = getGroupTags();
      action = actions.groupTags.set({ projectId, tags: groupTags });
      resultState = setGroupTags(state, action);
    });

    it('sets the groupTags', () => {
      expect(resultState).toBeDefined();
      expect(resultState[projectId]).toBeDefined();
      expect(resultState[projectId].tags).toBeDefined();
      expect(resultState[projectId].tags).toHaveLength(groupTags.length);
    });

    it('does not mutate state', () => {
      expect(resultState).not.toBe(state);
    });
  });

  describe('state is not empty', () => {
    beforeEach(() => {
      state = {
        [otherProjectId]: [{}, {}, {}],
      };
      groupTags = getGroupTags();
      action = actions.groupTags.set({ projectId, tags: groupTags });
      resultState = setGroupTags(state, action);
    });

    it('sets the groupTags', () => {
      expect(resultState).toBeDefined();
      expect(resultState[projectId]).toBeDefined();
      expect(resultState[projectId].tags).toBeDefined();
      expect(resultState[projectId].tags).toHaveLength(groupTags.length);
    });

    it('does not mutate state', () => {
      expect(resultState).not.toBe(state);
    });

    it('does not modify groupTags for other projects', () => {
      expect(resultState[otherProjectId]).toBe(state[otherProjectId]);
    });
  });
});

function getGroupTags() {
  return groupTagDtos.map((t) => ({ ...t }));
}
