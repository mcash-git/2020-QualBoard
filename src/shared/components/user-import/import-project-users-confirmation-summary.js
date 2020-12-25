import { computedFrom } from 'aurelia-framework';
import { ImportUsersConfirmationSummaryService } from
  './import-users-confirmation-summary-service';

export class ImportProjectUsersConfirmationSummary {
  activate({ bulkImportModel }) {
    this.service = new ImportUsersConfirmationSummaryService(bulkImportModel);
  }
  
  @computedFrom('service.existingProjectUserText')
  get existingProjectUserText() {
    return this.service.existingProjectUserText;
  }
  
  @computedFrom('service.willImportNewUsers')
  get willImportNewUsers() {
    return this.service.willImportNewUsers;
  }
}
