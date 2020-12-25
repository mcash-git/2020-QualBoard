export class MyProjectsActionBar {
  activate(model) {
    this.model = model;
  }
  
  attached() {
    this.searchElement.focus();
  }
}
