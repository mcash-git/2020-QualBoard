interface IParticipantFollowupOverviewModel {
  id?: string | null;
  entryId?: string | null;
  responseTimeStamp?: string | null;
}

export class ParticipantFollowupOverviewModel implements IParticipantFollowupOverviewModel {
  public id: string | null;
  public entryId: string | null;
  public responseTimeStamp: string | null;

  constructor(model: IParticipantFollowupOverviewModel) {
    this.id = model.id;
    this.entryId = model.entryId;
    this.responseTimeStamp = model.responseTimeStamp;
  }

  static fromDto(dto: any): ParticipantFollowupOverviewModel {
    const {
      id = null,
      repetitionId = null,
      entryId = null,
      responseTimeStamp = null,
    } = dto;
    return new ParticipantFollowupOverviewModel({
      id,
      entryId: entryId || repetitionId,
      responseTimeStamp,
    });
  }
}
