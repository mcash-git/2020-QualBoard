import { HttpClient } from 'aurelia-fetch-client';
import { AppConfig } from 'app-config';
import { ErrorHandler } from 'api/error-handler';

export class GroupTagsQueryApi {
  static inject = [HttpClient, 'QbApiHttpClient', AppConfig, ErrorHandler];

  constructor(http, apiHttp, appConfig, errorHandler) {
    http.configure(c => { c.useStandardConfiguration(); });
    apiHttp.baseUrl += 'projects/';

    this.apiHttp = apiHttp;
    this.appConfig = appConfig;
    this.http = http;
    this.errorHandler = errorHandler;
  }

  async getGroupTags(projectId) {
    try {
      const response = await this.apiHttp
        .fetch(`${projectId}/groups`);
      if (response.status === 204) {
        return null;
      }
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async getGroupTagsAndParticipants(projectId) {
    try {
      const response = await this.apiHttp
        .fetch(`${projectId}/users-and-groups`);
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }
}
