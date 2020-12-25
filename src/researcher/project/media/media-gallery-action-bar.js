export class MediaGalleryActionBar {
  activate(model) {
    this.model = model;
  }
  
  selectChanged() {
    this.model.router.navigate(this.model.currentRoute.href);
  }
}
