import { DialogService } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';

const addAccountEvent = 'account-added';
const modalPath = 'researcher/super/accounts/create-account-modal';

export class AccountsTableActionBar {
  static inject = [DialogService, EventAggregator];
  static addAccountEvent = addAccountEvent;

  constructor(dialogService, ea) {
    this.dialogService = dialogService;
    this.ea = ea;
  }

  activate(model) {
    this.model = model;
  }

  addAccount() {
    this.dialogService.open({
      viewModel: modalPath,
    }).whenClosed(result => {
      if (result.wasCancelled) {
        return;
      }
      this.model.handleAccountAdded();
    });
  }
}
