import addJob from 'researcher/state/jobs/reducers/add-job';
import { actions } from 'researcher/state/all-actions';
import jobDtos from 'dtos/jobs.json';
import jobDto from 'dtos/job.json';

describe('reducer: addJob()', () => {
  let state;
  let job;
  let action;
  let resultState;

  describe('state is null', () => {
    beforeEach(() => {
      state = null;
      job = getJob();
      action = actions.jobs.add({ job });
    });

    it('throws an error', () => {
      expect(() => addJob(state, action)).toThrow(/null/);
    });
  });

  describe('state is array of jobs', () => {
    beforeEach(() => {
      state = getJobs();
      job = getJob();
      action = actions.jobs.add({ job });
      resultState = addJob(state, action);
    });

    it('adds the job', () => {
      expect(resultState).toHaveLength(jobDtos.length + 1);
      expect(resultState.find(j => j.id === job.id)).toBeDefined();
    });

    it('does not mutate state', () => {
      expect(resultState).not.toBe(state);
      expect(state).toHaveLength(jobDtos.length);
    });
  });
});

function getJobs() {
  return jobDtos.map((j) => ({ ...j }));
}

function getJob() {
  return { ...jobDto };
}
