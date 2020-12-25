import { handleActions } from 'redux-actions';
import addResponse from './reducers/add-response';
import removeResponse from './reducers/remove-response';
import setResponseText from './reducers/set-response-text';
import setSubmitStatus from './reducers/set-submit-status';

const writeTaskResponseResponsesReducer = handleActions({
  WRITE_TASK_RESPONSE_RESPONSES: {
    ADD_RESPONSE: addResponse,
    REMOVE_RESPONSE: removeResponse,
    SET_RESPONSE_TEXT: setResponseText,
    SET_SUBMIT_STATUS: setSubmitStatus,
  },
}, {});

export default writeTaskResponseResponsesReducer;
