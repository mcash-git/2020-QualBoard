import { bindable } from 'aurelia-framework';
import { Api } from 'api/api';
import { enums } from '2020-qb4';

const ReadStatuses = enums.readStatuses;

export class ActivityEntriesResponseList {
  @bindable entriesByDate;
  @bindable selectedEntry;
  @bindable fetchMoreEntries;

  static inject = [Api];

  constructor(api) {
    this.api = api;
  }

  setSelectedEntry(entry) {
    this.selectedEntry = entry;
    this.markRead(entry);
  }

  async markRead(entry) {
    const readStatus = ReadStatuses[entry.readStatus.int];
    if (readStatus === ReadStatuses.read) {
      return;
    }

    const command = {
      projectId: entry.projectId,
      iaId: entry.iaId,
      repId: entry.id,
    };

    await this.api.command.individualActivities.markEntryAsRead(command);
    entry.readStatus = enums.readStatuses.read;
  }

  scrollCallback(scrollContext) {
    if (!scrollContext.isAtTop) {
      this.fetchMoreEntries();
    }
  }
}
