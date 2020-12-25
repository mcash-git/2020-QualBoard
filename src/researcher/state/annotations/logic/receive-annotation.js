import { createLogic } from 'redux-logic';
import { getAnnotationMetadata } from 'shared/utility/annotations/get-annotation-metadata';
import { actions } from '../../all-actions';

const { update, add } = actions.annotations;

export default createLogic({
  type: `${actions.annotations.receive}`,
  process({ getState, action }, dispatch, done) {
    const { annotation } = action.payload;
    const { annotations: allAnnotationsState, project } = getState();
    const annotationsState = allAnnotationsState[project.id];
    const annotations = annotationsState && annotationsState.annotations;

    if (!annotations) {
      done();
      return;
    }

    const meta = getAnnotationMetadata(annotation);
    if (meta.projectId !== project.id) {
      done();
    }

    const fromState = annotations.find((a) => a.id === annotation.id);

    if (fromState) {
      dispatch(update({ projectId: meta.projectId, annotation }));
    } else {
      dispatch(add({ projectId: meta.projectId, annotation }));
    }

    done();
  },
});
