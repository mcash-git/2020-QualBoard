import { HttpClient } from 'aurelia-fetch-client';
import { AppConfig } from 'app-config';
import { ErrorHandler } from 'api/error-handler';

export class EventParticipantsQueryApi {
  // TODO: When mock data is no longer needed, remove the reference to the generic HttpClient inject
  static inject = [HttpClient, 'QbApiHttpClient', AppConfig, ErrorHandler];

  constructor(http, apiHttp, appConfig, errorHandler) {
    http.configure(c => {
      c.useStandardConfiguration();
    });
    apiHttp.baseUrl += 'projects/';

    this.apiHttp = apiHttp;
    this.http = http;
    this.appConfig = appConfig;
    this.errorHandler = errorHandler;
  }

  async getForEvent(query) {
    try {
      const response = await this.apiHttp
        .fetch(`${query.projectId}/activities/${query.iaId}/participants`);

      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return [];
    }
  }
}
