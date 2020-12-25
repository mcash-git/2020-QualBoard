import { createLogic } from 'redux-logic';
import { actions } from '../../all-actions';

export default createLogic({
  type: `${actions.participantMedia.toggleSelectAsset}`,
  transform({ getState, action }, next) {
    const existingPayload = action.payload;
    const projectId = getState().project.id;
    next({
      ...action,
      payload: {
        ...existingPayload,
        projectId,
      },
    });
  },
});
