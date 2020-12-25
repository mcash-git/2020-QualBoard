import createTransformNestedTaskKeyedReducer from 'shared/utility/state/create-transform-nested-task-keyed-reducer';
import { arrayUtilities } from 'shared/utility/array-utilities';

const setSubmitStatus =
  createTransformNestedTaskKeyedReducer('responses', ({ parentResponseId, status }, responses = []) =>
    arrayUtilities.findAndMerge(
      responses,
      (r) => r.parentResponseId === parentResponseId,
      { status },
    ));

export default setSubmitStatus;
