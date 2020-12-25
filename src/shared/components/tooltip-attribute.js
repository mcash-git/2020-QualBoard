/* global $ */

import { bindable, customAttribute } from 'aurelia-framework';
import hoverIntent from 'hoverintent';

@customAttribute('tooltip')
export class TooltipAttribute {
  static inject = [Element];

  constructor(element) {
    this.element = element;
  }

  @bindable text;
  // TODO:  Support html.
  // @bindable html;
  @bindable placement;

  attached() {
    if (this.element.hasTooltip) {
      return;
    }
    this.element.hasTooltip = true;
    const $el = $(this.element);
    $el.tooltip({ trigger: 'manual', placement: this.placement || 'top' });
    hoverIntent(this.element, () => {
      if (this.text && this.text.trim()) {
        $el.tooltip('show');
      }
    }, () => {
      $el.tooltip('hide');
    });
  }
  
  unbind() {
    $(this.element).tooltip('dispose');
  }

  textChanged() {
    this.element.dataset.originalTitle = this.text;
  }
}
