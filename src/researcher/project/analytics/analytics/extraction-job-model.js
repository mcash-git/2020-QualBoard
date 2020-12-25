export class ExtractionJobModel {
  constructor({
    id = null,
    name = null,
    createdBy = null,
    createdOn = null,
    completedOn = null,
  } = {}) {
    this.id = id;
    this.name = name;
    this.createdBy = createdBy;
    this.createdOn = createdOn;
    this.completedOn = completedOn;
  }
}
