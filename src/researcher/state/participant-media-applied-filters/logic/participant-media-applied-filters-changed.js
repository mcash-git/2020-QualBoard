import { createLogic } from 'redux-logic';
import { actions } from '../../all-actions';

export default createLogic({
  type: /PARTICIPANT_MEDIA_APPLIED_FILTERS\/(?!TOGGLE)(?!FETCH)(?!SET_FETCH)(?!SET_EXPANDED)(?!SET_AVAILABLE_INDIVIDUAL_ACTIVITIES)/i,
  debounce: 50,
  async process({ action }, dispatch, done) {
    const { projectId } = action.payload;
    dispatch(actions.participantMedia.fetch({ projectId }));
    done();
  },
});
