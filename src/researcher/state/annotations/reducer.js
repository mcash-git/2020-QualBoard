import { handleActions } from 'redux-actions';

import setFetchStatus from '../misc/reducers/set-project-level-fetch-status';
import addAnnotation from './reducers/add-annotation';
import removeAnnotation from './reducers/remove-annotation';
import setAnnotations from './reducers/set-annotations';
import updateAnnotation from './reducers/update-annotation';

export default handleActions({
  ANNOTATIONS: {
    ADD: addAnnotation,
    REMOVE: removeAnnotation,
    SET: setAnnotations,
    UPDATE: updateAnnotation,
    SET_FETCH_STATUS: setFetchStatus,
  },
}, {});
