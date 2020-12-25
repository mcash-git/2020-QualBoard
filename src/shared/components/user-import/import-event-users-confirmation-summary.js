import { computedFrom } from 'aurelia-framework';
import { ImportUsersConfirmationSummaryService } from
  './import-users-confirmation-summary-service';

export class ImportEventUsersConfirmationSummary {
  activate({ bulkImportModel }) {
    this.service = new ImportUsersConfirmationSummaryService(bulkImportModel);
  }

  @computedFrom('service.bulkImportModel.mergeStrategy')
  get existingProjectUserText() {
    return this.service.existingProjectUserText;
  }
  
  // this won't change, so we need to `& oneTime` it.
  get existingEventUserText() {
    return this.service.existingEventUserText;
  }

  @computedFrom('counts', 'counts.existingProjectUserCount')
  get willImportNewUsers() {
    return this.service.willImportNewUsers;
  }
}
