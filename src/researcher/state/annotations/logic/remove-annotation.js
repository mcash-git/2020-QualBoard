import { createLogic } from 'redux-logic';
import { regexFactory } from 'shared/utility/regex-factory';
import { actions } from '../../all-actions';

export default createLogic({
  type: `${actions.annotations.remove}`,
  transform({ action }, next) {
    const existingPayload = action.payload;
    const projectIdRegex = regexFactory.getProjectIdFromInsightIriRegex();
    const [, projectId] = projectIdRegex.exec(existingPayload.targetResourceIri);
    const payload = {
      id: existingPayload.id,
      projectId,
    };
    next({
      ...action,
      payload,
    });
  },
});
