import hash from 'object-hash';
import { Api } from 'api/api';
import { CurrentUser } from 'shared/current-user';

const syncFrequency = 3000;

function generateListHash(items) {
  return (items && items.length) ?
    hash(items.map(item => item.mostRecentId)) :
    hash('');
}

export class RecentItems {
  static inject = [Api, CurrentUser];
  static instanceCount = 0;
  constructor(api, user) {
    RecentItems.instanceCount++;
    if (RecentItems.instanceCount > 1) {
      throw new Error('ERROR - There should only be one instance of RecentItems');
    }

    this.api = api;
    this.user = user;

    const keyBase = `identity-user:${this.user.userId}:recent-`;
    this.pKey = `${keyBase}projects`;
    this.aKey = `${keyBase}accounts`;

    this.update();
    this.syncIntervalId = window.setInterval(() => this.sync(), syncFrequency);
  }

  async update() {
    // we only want to update if we are not already in process..
    if (this.isUpdating) {
      return;
    }
    this.isUpdating = true;
    const { projects, accounts } = await this.api.query.navigation
      .recentItems();

    const { pFromStorage, aFromStorage } = this.getItemsFromStorage();

    const pHash = generateListHash(projects);

    if (itemIsInvalid(pFromStorage) || pFromStorage.hash !== pHash) {
      window.localStorage[this.pKey] =
        JSON.stringify({ hash: pHash, items: projects });

      this.projects = projects;
      this.pHash = pHash;
    }

    if (!this.user.isSuperUser) {
      this.isUpdating = false;
      return;
    }

    const aHash = generateListHash(accounts);

    if (itemIsInvalid(aFromStorage) || aFromStorage.hash !== aHash) {
      window.localStorage[this.aKey] =
        JSON.stringify({ hash: aHash, items: accounts });

      this.accounts = accounts;
      this.aHash = aHash;
    }
    this.isUpdating = false;
  }

  sync() {
    const { projects: pFromStorage, accounts: aFromStorage } =
      this.getItemsFromStorage();

    if (itemIsInvalid(pFromStorage) ||
      (this.user.isSuperUser && itemIsInvalid(aFromStorage))) {
      // localstorage has been tampered with, or unknown failure, retrieve
      // from API
      this.update();
      return;
    }

    if (pFromStorage.hash !== this.pHash) {
      this.pHash = pFromStorage.hash;
      this.projects = pFromStorage.items;
    }

    if (this.user.isSuperUser && aFromStorage.hash !== this.aHash) {
      this.aHash = aFromStorage.hash;
      this.accounts = aFromStorage.items;
    }
  }

  getItemsFromStorage() {
    return {
      projects: JSON.parse(window.localStorage[this.pKey] || '""'),
      accounts: this.user.isSuperUser ?
        JSON.parse(window.localStorage[this.aKey] || '""') :
        null,
    };
  }
}

function itemIsInvalid(item) {
  return !item || !item.hash || !item.items;
}
