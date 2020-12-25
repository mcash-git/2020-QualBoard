import createTransformNestedTaskKeyedReducer from 'shared/utility/state/create-transform-nested-task-keyed-reducer';
import { arrayUtilities } from 'shared/utility/array-utilities';

const addResponse =
  createTransformNestedTaskKeyedReducer('responses', ({ parentResponseId }, responses = []) =>
    arrayUtilities.findAndRemove(responses, (r) => r.parentResponseId === parentResponseId), false);

export default addResponse;
