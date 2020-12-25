import { HttpClient } from 'aurelia-fetch-client';
import { AppConfig } from 'app-config';
import { ErrorHandler } from 'api/error-handler';
import { CurrentUser } from 'shared/current-user';

const numItemsToRetrieve = 10;
const queryString = `projectCount=${numItemsToRetrieve}&accountCount=${
  numItemsToRetrieve}`;

export class NavigationQueryApi {
  // TODO: When mock data is no longer needed, remove the reference to the
  // generic HttpClient injected
  static inject = [
    HttpClient,
    'QbApiHttpClient',
    AppConfig,
    ErrorHandler,
    CurrentUser,
  ];

  constructor(http, apiHttp, appConfig, errorHandler, user) {
    http.configure(c => { c.useStandardConfiguration(); });
    apiHttp.baseUrl += 'navigation/';

    this.apiHttp = apiHttp;
    this.http = http;
    this.appConfig = appConfig;
    this.errorHandler = errorHandler;
    this.user = user;
  }

  async recentItems() {
    try {
      if (this.user.isSuperUser) {
        const [su, nonSu] = await Promise.all([
          (await this.apiHttp.fetch(`mostrecentlist?${queryString}`)).json(),
          (await this.apiHttp.fetch(`mostrecentlist-moderator?${queryString}`))
            .json(),
        ]);

        su.projects.forEach(p => this.setProjectFields(p));
        su.accounts.forEach(a => this.setAccountFields(a));
        nonSu.projects.forEach(p => this.setProjectFields(p));

        return {
          projects: mergeLists(su.projects, nonSu.projects),
          accounts: su.accounts,
        };
      }
      return this._getRecentForNonSuperUser();
    } catch (e) {
      return { };
    }
  }

  async _getRecentForNonSuperUser() {
    let [mod, participant] = await Promise.all([
      (await this.getModeratorRecentProjects()),
      (await this.getParticipantRecentProjects()),
    ]);

    if (!mod.projects) {
      mod = { projects: [] };
    }

    if (!participant.projects) {
      participant = { projects: [] };
    }

    mod.projects.forEach(p => this.setProjectFields(p, 0));
    participant.projects.forEach(p => this.setProjectFields(p, 3));

    return { projects: mergeLists(mod.projects, participant.projects) };
  }

  async getModeratorRecentProjects() {
    try {
      const response = await this.apiHttp.fetch(`mostrecentlist-moderator?${queryString}`);
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return { projects: [], accounts: [] };
    }
  }

  async getParticipantRecentProjects() {
    try {
      const response = await this.apiHttp.fetch(`mostrecentlist-participant?${queryString}`);
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return { projects: [], accounts: [] };
    }
  }

  setProjectFields(p, userRole) {
    if (userRole === undefined && this.user.isSuperUser) {
      p.url = `/#/accounts/${p.parentId}/projects/${p.mostRecentId}`;
    } else if (userRole === 3) {
      p.url = `/#/participant/projects/${p.mostRecentId}/users/${p.userId}/dashboard`;
    } else {
      p.url = `/#/projects/${p.mostRecentId}`;
    }

    p.name = this.user.isSuperUser || userRole === 0 ?
      p.privateName :
      p.publicName;
  }

  setAccountFields(a) {
    a.url = `/#/super/accounts/${a.mostRecentId}`;
    a.name = a.privateName;
  }
}

function compareRecentItemsByTimeStamp(item1, item2) {
  if (item1.dateTimeStamp < item2.dateTimeStamp) { return 1; }
  if (item1.dateTimeStamp > item2.dateTimeStamp) { return -1; }
  return 0;
}

function mergeLists(l1, l2) {
  const all = [...l1, ...l2].sort(compareRecentItemsByTimeStamp);

  const { removeIndeces } = all.reduce((out, curr, i) => {
    if (out.lookup[curr.mostRecentId]) {
      out.removeIndeces.push(i);
    } else {
      out.lookup[curr.mostRecentId] = true;
    }

    return out;
  }, { lookup: {}, removeIndeces: [] });

  for (let i = removeIndeces.length - 1; i >= 0; i--) {
    all.splice(removeIndeces[i], 1);
  }

  return all.slice(0, 10);
}
