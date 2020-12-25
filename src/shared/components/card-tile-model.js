export class CardTileModel {
  constructor({
    bottomStatItems = [],
    button = null,
    labeledDetailItems = [],
    subtitle = null,
    title = null,
    titleIconClass = null,
    height = '17rem',
  } = {}) {
    this.bottomStatItems = bottomStatItems;
    this.button = button;
    this.labeledDetailItems = labeledDetailItems;
    this.subtitle = subtitle;
    this.title = title;
    this.titleIconClass = titleIconClass;
    this.height = height;
  }
}
