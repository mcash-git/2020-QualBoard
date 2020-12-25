export class ListCardModel {
  constructor({
    button = null,
    detailItems = [],
    iconClass = null,
    subtitle = null,
    title = null,
  } = {}) {
    this.button = button;
    this.detailItems = detailItems;
    this.iconClass = iconClass;
    this.subtitle = subtitle;
    this.title = title;
  }
}
