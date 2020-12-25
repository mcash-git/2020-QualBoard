import createTransformNestedTaskKeyedReducer from 'shared/utility/state/create-transform-nested-task-keyed-reducer';
import { arrayUtilities } from 'shared/utility/array-utilities';

const addResponse =
  createTransformNestedTaskKeyedReducer('responses', ({ response }, responses = []) =>
    arrayUtilities.add(responses, response), false);

export default addResponse;
