import createTransformNestedTaskKeyedReducer from 'shared/utility/state/create-transform-nested-task-keyed-reducer';
import { arrayUtilities } from 'shared/utility/array-utilities';

const setResponseText =
  createTransformNestedTaskKeyedReducer('responses', ({ parentResponseId, text }, responses = []) =>
    arrayUtilities.findAndMerge(
      responses,
      (r) => r.parentResponseId === parentResponseId,
      { text },
    ));

export default setResponseText;
