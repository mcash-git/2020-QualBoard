import { HttpClient } from 'aurelia-fetch-client';
import { AppConfig } from 'app-config';
import { ErrorHandler } from 'api/error-handler';

export class MediaQueryApi {
  static inject = [HttpClient, 'QbApiHttpClient', AppConfig, ErrorHandler];

  constructor(http, apiHttp, appConfig, errorHandler) {
    http.configure(c => { c.useStandardConfiguration(); });

    this.httpClient = http;
    this.apiHttp = apiHttp;
    this.appConfig = appConfig;
    this.apiHttp.baseUrl = `${this.appConfig.media.baseUrl}/api/`;
    this.errorHandler = errorHandler;
  }

  async getAssetsByProjectId(projectId, options) {
    try {
      let response = null;
      if (options) {
        response = await this.apiHttp
          .fetch(`projects/${projectId}/assets?pageSize=${options.pageSize}&page=${options.page}&includedScopes=${options.includedScopes}`);
      } else {
        response = await this.apiHttp.fetch(`projects/${projectId}/assets`);
      }
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async deleteAsset(id) {
    try {
      const response = await this.apiHttp.fetch(`assets/${id}`, { method: 'DELETE' });
      this.errorHandler.checkStatus(response);
      return true;
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }
}
