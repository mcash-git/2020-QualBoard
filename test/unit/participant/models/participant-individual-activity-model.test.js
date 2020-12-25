import { ParticipantIndividualActivityModel } from 'participant/models/participant-individual-activity-model';
import { ParticipantEntryOverviewModel } from 'participant/models/participant-entry-overview-model';
import individualActivityDto from 'dtos/individual-activity.json';

const userTimeZone = 'America/Chicago';
describe('ProjectUserModel', () => {
  describe('(static) fromDto()', () => {
    let model;
    beforeEach(() => {
      model = ParticipantIndividualActivityModel.fromDto(individualActivityDto, userTimeZone);
    });
    
    it('maps .entries to ParticipantEntryOverviewModels', () => {
      expect(model.entries).toHaveLength(individualActivityDto.entries.length);
      
      model.entries.forEach(e => {
        expect(e.constructor.name).toBe(ParticipantEntryOverviewModel.name);
      });
    });
    
    it('maps .repeatUnit int to RepeatUnit enum object', () => {
      expect(model.repeatUnit).toBeDefined();
      expect(model.repeatUnit.int).toBe(individualActivityDto.repeatUnit);
    });
  });
});
