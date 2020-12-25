import { Annotation } from '2020-annotations';
import { actions } from 'researcher/state/all-actions';
import removeAnnotation from 'researcher/state/annotations/reducers/remove-annotation';
import annotationDtos from 'dtos/video-annotations.json';
import annotationDto from 'dtos/video-annotation.json';

const projectId = 'project';
const otherProjectId = 'some-other-project';

describe('reducer: removeAnnotation()', () => {
  let state;
  let annotation;
  let annotations;
  let action;
  let resultState;

  describe('annotations for provided project ID are not in state', () => {
    beforeEach(() => {
      state = {
        [otherProjectId]: getAnnotations(),
      };
      annotation = getAnnotation();
      action = actions.annotations.remove({ projectId, id: annotation.id });
      action.payload.projectId = projectId;
      resultState = removeAnnotation(state, action);
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
    });

    describe('annotation is present', () => {
      beforeEach(() => {
        annotation = annotations[0];
        action = actions.annotations.remove({ projectId, id: annotation.id });
        action.payload.projectId = projectId;
        resultState = removeAnnotation(state, action);
      });

      it('removes the annotation', () => {
        expect(resultState[projectId]).toBeDefined();
        expect(resultState[projectId].annotations).toHaveLength(annotationDtos.length - 1);
        expect(resultState[projectId].annotations.find((a) => a.id === annotation.id))
          .not.toBeDefined();
      });

      it('does not mutate state', () => {
        expect(resultState).not.toBe(state);
        expect(resultState[projectId]).not.toBe(state[projectId]);
        expect(resultState[projectId].annotations).not.toBe(state[projectId].annotations);
      });
    });

    describe('annotation is not present', () => {
      beforeEach(() => {
        annotation = getAnnotation();
        action = actions.annotations.remove({ projectId, id: annotation.id });
        action.payload.projectId = projectId;
      });

      it('throws an error', () => {
        expect(() => removeAnnotation(state, action)).toThrow(/found/);
      });
    });
  });
});

function getAnnotations() {
  return annotationDtos.map((a) => Annotation.parse(a));
}

function getAnnotation() {
  return Annotation.parse(annotationDto);
}
