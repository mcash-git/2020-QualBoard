import updateJob from 'researcher/state/jobs/reducers/update-job';
import { actions } from 'researcher/state/all-actions';
import jobDtos from 'dtos/jobs.json';
import jobDto from 'dtos/job.json';

describe('reducer: updateJob()', () => {
  let state;
  let job;
  let action;
  let resultState;

  describe('state is null', () => {
    beforeEach(() => {
      state = null;
      job = getJob();
      action = actions.jobs.update({ jobUpdate: job });
    });

    it('throws an error', () => {
      expect(() => updateJob(state, action)).toThrow(/null/);
    });
  });

  describe('state is array of jobs', () => {
    beforeEach(() => {
      state = getJobs();
    });

    describe('job exists in state', () => {
      beforeEach(() => {
        state.forEach((s) => { s.progress = 0.5; });
        job = {
          ...state[0],
          progress: 1,
        };
        action = actions.jobs.update({ jobUpdate: job });
        resultState = updateJob(state, action);
      });

      it('updates the job', () => {
        expect(resultState).toHaveLength(jobDtos.length);
        expect(resultState.find(j => j.id === job.id)).toBeDefined();
        expect(resultState.find(j => j.id === job.id).progress).toBe(job.progress);
      });

      it('does not mutate state', () => {
        expect(resultState).not.toBe(state);
        expect(state.find(j => j.id === job.id).progress).not.toBe(job.progress);
      });
    });
  });
});

function getJobs() {
  return jobDtos.map((j) => ({ ...j }));
}

function getJob() {
  return { ...jobDto };
}
