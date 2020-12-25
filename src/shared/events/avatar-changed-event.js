export class AvatarChangedEvent {
  userId;
  email;
  constructor({
    userId = null,
    email = null,
  } = {}) {
    this.userId = userId;
    this.email = email;
  }
}
