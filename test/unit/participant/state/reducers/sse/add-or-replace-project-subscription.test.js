import { receiveProjectDashboardEvents } from 'participant/state/actions/all';
import { addOrReplaceProjectSubscription}
  from 'participant/state/reducers/sse/add-or-replace-project-subscription'

const projectId = 'some-project-id';

describe('sse/addOrReplaceProjectSubscription()', () => {
  let state;
  let action;
  let resultState;
  let sse;
  
  describe('when the user has not subscribed to any project\'s SSE channel', () => {
    it('adds the correct SSE channel ID to result.subscribedChannels', () => {
      state = { sse: { subscribedChannels: [] } };
      action = receiveProjectDashboardEvents(projectId, []);
      resultState = addOrReplaceProjectSubscription(state, action);
      sse = resultState.sse;
      expect(sse.subscribedChannels).toHaveLength(1);
      expect(sse.subscribedChannels[0]).toBe(`participant-project-${projectId}`);
    });
  });

  describe('when the user has subscribed to another project\'s SSE channel', () => {
    beforeEach(() => {
      state = {
        sse: {
          subscribedChannels: ['participant-project-some-other-id'],
        },
      };
    });
  
    it('replaces the existing channel subscription with the current project\'s', () => {
      action = receiveProjectDashboardEvents(projectId, [{ id: '1', projectId }]);
      resultState = addOrReplaceProjectSubscription(state, action);
      sse = resultState.sse;
      
      expect(sse.subscribedChannels).toHaveLength(1);
      expect(sse.subscribedChannels[0]).toBe(`participant-project-${projectId}`);
    });
  
    it('leaves unrelated channel subscriptions in the collection', () => {
      const otherChannelId = 'some-other-channel';
      state.sse.subscribedChannels.push(otherChannelId);
    
      action = receiveProjectDashboardEvents(projectId, [{ id: '1', projectId }]);
  
      resultState = addOrReplaceProjectSubscription(state, action);
      sse = resultState.sse;
    
      expect(sse.subscribedChannels).toHaveLength(2);
      expect(sse.subscribedChannels.some(c => c === `participant-project-${projectId}`))
        .toBe(true);
      expect(sse.subscribedChannels.some(c => c === otherChannelId))
        .toBe(true);
    });
  });
});
