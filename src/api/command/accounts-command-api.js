import { json } from 'aurelia-fetch-client';
import { ErrorHandler } from 'api/error-handler';

export class AccountsCommandApi {
  static inject = ['QbApiHttpClient', ErrorHandler];

  constructor(apiHttp, errorHandler) {
    apiHttp.baseUrl += 'accounts/';
    this.apiHttp = apiHttp;
    this.errorHandler = errorHandler;
  }

  async create(accountModel) {
    try {
      const response = await this.apiHttp.fetch('', {
        method: 'post',
        body: json(accountModel.toDto()),
      });
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async setName(accountModel) {
    try {
      const response = await this.apiHttp.fetch(`${accountModel.id}/change-name`, {
        method: 'post',
        body: json(accountModel.toDto()),
      });
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }
}
