import { bindable, bindingMode } from 'aurelia-framework';
import { CurrentUser } from 'shared/current-user';
import { enums } from '2020-qb4';

const ReadStatuses = enums.readStatuses;

export class EntryCard {
  @bindable({ defaultBindingMode: bindingMode.oneWay }) entry;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) participant;

  static inject = [CurrentUser];

  constructor(currentUser) {
    this.currentUser = currentUser;
  }

  get readStatusClassName() {
    const readStatus = ReadStatuses[this.entry.readStatus.int];
    let className = '';
    switch (readStatus) {
      case ReadStatuses.read:
        className = '';
        break;
      case ReadStatuses['partially-read']:
        className = 'partially-read';
        break;
      case ReadStatuses.unread:
        className = 'unread';
        break;
      default:
        className = 'unread';
    }
    return className;
  }
}
