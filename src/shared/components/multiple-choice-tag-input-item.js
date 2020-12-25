export class MultipleChoiceTagInputItem {
  activate({
    item = null,
  } = {}) {
    this.option = item;
  }
  
  remove() {
    this.liElement.dispatchEvent(new CustomEvent('remove-tag', {
      bubbles: true,
      detail: { item: this.option },
    }));
  }
}
