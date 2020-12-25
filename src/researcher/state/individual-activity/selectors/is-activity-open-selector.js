import { createSelector } from 'reselect';
import moment from 'moment';

const isActivityOpenSelector = createSelector(
  (state) => state.individualActivity,
  (activity) => {
    const now = moment();
    const activityOpen = moment(activity.openTime);
    const activityClose = moment(activity.closeTime);

    return activityOpen < now && now < activityClose;
  },
);

export default isActivityOpenSelector;
