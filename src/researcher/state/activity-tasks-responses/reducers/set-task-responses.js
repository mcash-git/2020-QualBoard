import createTransformNestedTaskKeyedReducer from 'shared/utility/state/create-transform-nested-task-keyed-reducer';

const setTaskResponses =
  createTransformNestedTaskKeyedReducer('responses', ({ responses }) =>
    responses, false);

export default setTaskResponses;
