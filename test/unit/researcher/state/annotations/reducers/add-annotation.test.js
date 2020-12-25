import { Annotation } from '2020-annotations';
import { actions } from 'researcher/state/all-actions';
import addAnnotation from 'researcher/state/annotations/reducers/add-annotation';
import annotationDtos from 'dtos/video-annotations.json';
import annotationDto from 'dtos/video-annotation.json';

const projectId = 'project';
const otherProjectId = 'some-other-project';

describe('reducer: addAnnotation()', () => {
  let state;
  let annotation;
  let annotations;
  let action;
  let resultState;

  describe('annotations for provided project ID are not in state', () => {
    beforeEach(() => {
      annotations = getAnnotations();
      state = {
        [otherProjectId]: {
          annotations,
        },
      };
      annotation = getAnnotation();
      action = actions.annotations.add({ projectId, annotation });
      resultState = addAnnotation(state, action);
    });

    it('returns state unchanged', () => {
      expect(resultState).toBe(state);
    });
  });

  describe('annotations for provided project ID are in state', () => {
    beforeEach(() => {
      annotations = getAnnotations();
      state = {
        [projectId]: {
          annotations,
        },
      };
      annotation = getAnnotation();
      action = actions.annotations.add({ projectId, annotation });
      resultState = addAnnotation(state, action);
    });

    it('adds the annotation', () => {
      expect(resultState[projectId]).toBeDefined();
      expect(resultState[projectId].annotations).toBeDefined();
      expect(resultState[projectId].annotations).toHaveLength(annotations.length + 1);
    });

    it('does not mutate state', () => {
      expect(resultState).not.toBe(state);
      expect(resultState[projectId]).not.toBe(state[projectId]);
      expect(resultState[projectId].annotations).not.toBe(state[projectId].annotations);
    });
  });
});

function getAnnotations() {
  return annotationDtos.map((a) => Annotation.parse(a));
}

function getAnnotation() {
  return Annotation.parse(annotationDto);
}
