import createTransformNestedActivityKeyedReducer from 'shared/utility/state/create-transform-nested-activity-keyed-reducer';

const selectTask = createTransformNestedActivityKeyedReducer(
  'selectedTaskId',
  ({ taskId }) => taskId,
);

export default selectTask;
