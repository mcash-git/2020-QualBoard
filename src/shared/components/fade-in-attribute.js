import { customAttribute, bindable, bindingMode } from 'aurelia-framework';

@customAttribute('fade-in')
export class FadeInAttribute {
  static inject = [Element];
  constructor(element) {
    this.element = element;
    this.element.classList.add('transparent');
    this.element.style.transitionProperty = 'opacity';
    this.element.style.transitionDuration = '0.15s';
    this.element.style.transitionTimingFunction = 'linear';
  }

  @bindable({ defaultBindingMode: bindingMode.oneTime }) duration;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) delay;

  durationChanged(newValue) {
    this.element.style.transitionDuration = newValue;
  }

  delayChanged(newValue) {
    this.element.style.transitionDelay = newValue;
  }

  attached() {
    this.element.classList.remove('transparent');
  }
}
