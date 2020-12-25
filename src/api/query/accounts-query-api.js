import { AccountModel } from 'researcher/account/account-model';
import { ErrorHandler } from 'api/error-handler';

export class AccountsQueryApi {
  // TODO: When mock data is no longer needed, remove the reference to the
  // generic HttpClient inject; remove all json requests
  static inject = ['QbApiHttpClient', ErrorHandler];

  constructor(apiHttp, errorHandler) {
    apiHttp.baseUrl += 'accounts/';

    this.apiHttp = apiHttp;
    this.errorHandler = errorHandler;
  }

  async allAccounts(query) {
    try {
      const response = await this.apiHttp
        .fetch(`${this.buildQuery(query)}`);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  buildQuery(query) {
    let queryString = '?';
    Object.entries(query).forEach(([key, value]) => {
      queryString += `${key}=${value}&`;
    });

    return queryString;
  }

  async overview(id) {
    try {
      const response = await this.apiHttp.fetch(`${id}/overview`);
      this.errorHandler.checkStatus(response);
      return new AccountModel(await response.json());
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async projects(id) {
    try {
      const response = await this.apiHttp.fetch(`${id}/dash`);
      this.errorHandler.checkStatus(response);
      // TODO:  When accounts are truly wired up, uncomment this so MRU
      // accounts is always up to date:
      // this.recentItems.update();
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  // HACK:  This is not the permanent way to do this; waiting on the back end
  // API to expose the kosher endpoint.
  async getAllNames() {
    try {
      const response = await this.apiHttp.fetch(`datatables?draw=1&columns[0][data]=name&columns[0][name]=Name&columns[0][searchable]=true&columns[0][orderable]=true&columns[0][search][value]=&columns[0][search][regex]=false&order[0][column]=0&order[0][dir]=asc&start=0&length=10000&search[value]=&search[regex]=false&_=${new Date().getTime()}`);
      this.errorHandler.checkStatus(response);
      // TODO:  When accounts are truly wired up, uncomment this so MRU
      // accounts is always up to date:
      // this.recentItems.update();
      const obj = await response.json();
      return obj.data.map(d => d.name);
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }
}
