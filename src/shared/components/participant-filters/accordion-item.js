/* global $ */
import { bindable, bindingMode } from 'aurelia-framework';
import { safeSessionStorage } from 'shared/utility/safe-session-storage';

export class AccordionItem {
  @bindable({ defaultBindingMode: bindingMode.oneTime }) title;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) isRequired;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) badgeCount;
  @bindable isExpanded;

  @bindable({ defaultBindingMode: bindingMode.oneTime })
  expandedSessionStorageKey;

  bind() {
    if (this.shouldSaveState) {
      this.isExpanded = safeSessionStorage
        .getObject(this.expandedSessionStorageKey);
    }
  }

  toggle() {
    $(this.sectionElement).collapse(this.isExpanded ? 'hide' : 'show');
    this.isExpanded = !this.isExpanded;

    if (this.shouldSaveState) {
      safeSessionStorage.setObject(
        this.expandedSessionStorageKey,
        this.isExpanded,
      );
    }
  }

  get shouldSaveState() {
    return !!this.expandedSessionStorageKey;
  }
}
