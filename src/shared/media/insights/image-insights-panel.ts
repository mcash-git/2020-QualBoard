import { computedFrom, bindable, bindingMode } from 'aurelia-framework';
import { MediaDescriptorModel } from 'shared/media/media-descriptor-model';

export class ImageInsightsPanel {
  static inject = [Element];

  constructor(
    element:Element,
  ) {
    this.element = element;

    element.className = 'media-insights-panel';
  }

  element:Element;

  @bindable({ defaultBindingMode: bindingMode.twoWay }) isOpen:boolean;
  @bindable mediaItem:MediaDescriptorModel;
  @bindable projectId:string;

  open() : void {
    if (this.isOpen) {
      return;
    }

    this.isOpen = true;
    this.element.classList.add('active');
  }

  close() : void {
    if (!this.isOpen) {
      return;
    }
    this.isOpen = false;
    this.element.classList.remove('active');
  }

  toggleOpen() : void {
    // TODO: probably replace with "tryClose" to make sure we do dirty check, etc.
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  @computedFrom('isOpen')
  get toggleOpenIconClass() {
    return this.isOpen ? 'icon-ion-chevron-right' : 'icon-lightbulb_outline';
  }
}
