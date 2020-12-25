export class ProjectsActionBar {
  activate(model) {
    this.model = model;
  }
  
  attached() {
    this.searchElement.focus();
  }

  addProject() {
    this.model.addProject();
  }
}
