import { Annotation } from '2020-annotations';
import { actions } from 'researcher/state/all-actions';
import setAnnotations from 'researcher/state/annotations/reducers/set-annotations';
import annotationDtos from 'dtos/video-annotations.json';

const projectId = 'mole-hunter-v-project';
const otherProjectId = 'skim-milk-heroes';

describe('reducer: setAnnotations()', () => {
  let state;
  let annotations;
  let action;
  let resultState;

  describe('state is empty', () => {
    beforeEach(() => {
      state = {};
      annotations = getAnnotations();
      action = actions.annotations.set({ projectId, annotations });
      resultState = setAnnotations(state, action);
    });

    it('sets the annotations', () => {
      expect(resultState).toBeDefined();
      expect(resultState[projectId]).toBeDefined();
      expect(resultState[projectId].annotations).toBeDefined();
      expect(resultState[projectId].annotations).toHaveLength(annotations.length);
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
      annotations = getAnnotations();
      action = actions.annotations.set({ projectId, annotations });
      resultState = setAnnotations(state, action);
    });

    it('sets the annotations', () => {
      expect(resultState).toBeDefined();
      expect(resultState[projectId]).toBeDefined();
      expect(resultState[projectId].annotations).toBeDefined();
      expect(resultState[projectId].annotations).toHaveLength(annotations.length);
    });

    it('does not mutate state', () => {
      expect(resultState).not.toBe(state);
    });

    it('does not modify annotations for other projects', () => {
      expect(resultState[otherProjectId]).toBe(state[otherProjectId]);
    });
  });
});

function getAnnotations() {
  return annotationDtos.map((a) => Annotation.parse(a));
}
