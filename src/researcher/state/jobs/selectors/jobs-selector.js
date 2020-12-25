import { createSelector } from 'reselect';
import { JobsModel } from 'shared/models/jobs-model';
import { compareByDateTime } from 'shared/utility/compare-by-date-time';

const compareJobs = (a, b) => compareByDateTime(a.createdOn, b.createdOn);

export default createSelector(
  (state) => state.jobs,
  (state) => state.currentUser.timeZone,
  (jobs, currentUserTimeZone) => {
    if (!jobs) {
      return null;
    }
    
    const sorted = [...jobs].sort(compareJobs).slice(0, 10);
    
    return JobsModel.fromDto(sorted, currentUserTimeZone);
  },
);
