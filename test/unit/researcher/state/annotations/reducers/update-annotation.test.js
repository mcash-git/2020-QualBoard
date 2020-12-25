import { Annotation } from '2020-annotations';
import { actions } from 'researcher/state/all-actions';
import updateAnnotation from 'researcher/state/annotations/reducers/update-annotation';
import annotationDtos from 'dtos/video-annotations.json';
import annotationDto from 'dtos/video-annotation.json';

const projectId = 'project';
const otherProjectId = 'some-other-project';

describe('reducer: updateAnnotation()', () => {
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
      action = actions.annotations.update({ projectId, annotation });
      resultState = updateAnnotation(state, action);
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
        annotation = getAnnotation();
        annotation.id = annotations[0].id;
        annotation.zipZop = 'j-e-l-l-o it\'s alive!';
        action = actions.annotations.update({ projectId, annotation });
        resultState = updateAnnotation(state, action);
      });

      it('replaces the annotation', () => {
        expect(resultState[projectId]).toBeDefined();
        expect(resultState[projectId].annotations).toHaveLength(annotationDtos.length);

        const fromResult = resultState[projectId].annotations.find((a) => a.id === annotation.id);
        expect(fromResult).toBeDefined();
        expect(fromResult).toBe(annotation);
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
        action = actions.annotations.update({ projectId, annotation });
      });

      it('throws an error', () => {
        expect(() => updateAnnotation(state, action)).toThrow(/found/);
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
