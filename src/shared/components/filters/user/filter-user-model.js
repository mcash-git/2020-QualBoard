export class FilterUserModel {
  constructor({
    availableUsers = [],
    chosenUsers = [],
    mode = null,
    subHeader = null,
    title = null,
  }) {
    this.availableUsers = availableUsers;
    this.chosenUsers = chosenUsers;
    this.mode = mode;
    this.subHeader = subHeader;
    this.title = title;
  }
}
