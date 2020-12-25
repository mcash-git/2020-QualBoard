import { HttpClient } from 'aurelia-fetch-client';
import { AppConfig } from 'app-config';
import { ErrorHandler } from 'api/error-handler';

export class ReportingQueryApi {
  static inject = [HttpClient, 'QbApiHttpClient', AppConfig, ErrorHandler];

  constructor(http, apiHttp, appConfig, errorHandler) {
    http.configure(c => {
      c.useStandardConfiguration();
    });
    apiHttp.baseUrl += 'reporting/projects/';

    this.apiHttp = apiHttp;
    this.appConfig = appConfig;
    this.http = http;
    this.errorHandler = errorHandler;
  }

  async getReports(projectId) {
    try {
      const response = await this.apiHttp
        .fetch(`${projectId}/configuration`);
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return false;
    }
  }

  async downloadParticipation(projectId, iaId) {
    try {
      const response = await this.apiHttp
        .fetch(`${projectId}/events/${iaId}/participation`);
      this.errorHandler.checkStatus(response);
      return response.blob();
    } catch (e) {
      this.errorHandler.handleError(e);
      return false;
    }
  }

  async startCrosstabJob(projectId, configId) {
    try {
      const response = await this.apiHttp
        .fetch(`${projectId}/crosstab-background/${configId}`);
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async startTranscriptJob(projectId, configId) {
    try {
      const response = await this.apiHttp
        .fetch(`${projectId}/transcript-background/${configId}`);
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }
}
