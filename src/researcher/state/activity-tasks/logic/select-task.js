import { createLogic } from 'redux-logic';
import { actions } from '../../all-actions';

const selectTask = createLogic({
  type: `${actions.activityTasks.selectTask}`,
  process({ action }, dispatch, done) {
    dispatch(actions.activityTasksResponses.fetch(action.payload));
    done();
  },
});

export default selectTask;
