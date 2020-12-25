import createTransformNestedActivityKeyedReducer from 'shared/utility/state/create-transform-nested-activity-keyed-reducer';

const setTasks = createTransformNestedActivityKeyedReducer('tasks', ({ tasks }) => tasks, false);

export default setTasks;
