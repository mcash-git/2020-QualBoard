export class EventsActionBar {
  activate(model) {
    this.model = model;
  }
  
  attached() {
    this.searchElement.focus();
  }
}
