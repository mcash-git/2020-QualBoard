export class DefaultTagViewModel {
  activate({
    item = null,
    displayItem = null,
  } = {}) {
    this.displayItem = displayItem;
    this.item = item;
  }
  
  removeTag() {
    this.liElement.dispatchEvent(new CustomEvent('remove-tag', {
      bubbles: true,
      detail: { item: this.item },
    }));
  }
}
