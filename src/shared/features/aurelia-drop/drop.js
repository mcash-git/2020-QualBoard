import Drop from 'tether-drop/dist/js/drop.js';

export class DropCustomAttribute {
  static inject = [Element];

  constructor(element) {
    this.element = element;
  }

  bind() {
    this.options = this.value;
  }

  attached() {
    const o = this.options;
    const target = o.target ? o.target : this.element.querySelector('.drop-target');
    const content = o.content ? o.content : this.element.querySelector('.drop-body');
    const position = o.position ? o.position : 'bottom center';
    const remove = o.remove ? o.remove : true;
    const openOn = o.openOn ? o.openOn : 'click';
    const classes = o.classes ? o.classes : 'drop-theme-filters';

    /* eslint-disable */
    new Drop({
      target,
      content,
      position: position,
      remove:  remove,
      openOn: openOn,
      classes: classes,
    });
    /* eslint-enable */
  }
}
