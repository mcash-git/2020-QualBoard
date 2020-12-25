import { bindable, bindingMode, customElement } from 'aurelia-framework';
import { enums } from '2020-aurelia-bulk-import';

const ImportOverwriteBehaviors = enums.importOverwriteBehaviors;

@customElement()
export class ImportUsersMergeStrategyPicker {
  constructor() {
    this.importOverwriteBehaviors = ImportOverwriteBehaviors;
  
    this.descriptionLookup = {};
    this.descriptionLookup[ImportOverwriteBehaviors.none.int] = 'Make no changes to existing users';
    this.descriptionLookup[ImportOverwriteBehaviors.all.int] = 'Replace all user fields with import data (even if the field is empty)';
    this.descriptionLookup[ImportOverwriteBehaviors.targetFieldNull.int] = 'Update only the fields that are empty for existing users (will not overwrite existing data)';
    this.descriptionLookup[ImportOverwriteBehaviors.sourceFieldNotNull.int] = 'Update any field that is included in the import (will replace existing data if the import includes it)';
  }
  
  @bindable({ defaultBindingMode: bindingMode.twoWay }) mergeStrategy;
}
