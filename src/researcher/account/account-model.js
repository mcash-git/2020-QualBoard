export class AccountModel {
  constructor({
    name = null,
    id = null,
    isActive = null,
    number = null,
    parentAccountId = null,
    activeProjectCount = null,
  } = {}) {
    this.name = name;
    this.id = id;
    this.isActive = isActive;
    this.number = number;
    this.parentAccountId = parentAccountId;
    this.activeProjectCount = activeProjectCount;
  }
  
  clone() {
    return new AccountModel(this);
  }
  
  toDto() {
    return { name: this.name, id: this.id };
  }
}
