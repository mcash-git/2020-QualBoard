import { ErrorHandler } from 'api/error-handler';
import { json } from 'aurelia-fetch-client';

export class ReportsCommandApi {
  static inject = ['QbApiHttpClient', ErrorHandler];

  constructor(apiHttp, errorHandler) {
    apiHttp.baseUrl += 'reporting/';
    this.apiHttp = apiHttp;
    this.errorHandler = errorHandler;
  }

  async createUpdateCrosstab(crosstabReport) {
    try {
      const response = await this.apiHttp
        .fetch(`projects/${crosstabReport.projectId}/configuration/crosstab`, {
          method: 'post',
          body: json(crosstabReport.toDto()),
        });
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async createUpdateTranscripts(transReport) {
    try {
      const response = await this.apiHttp
        .fetch(`projects/${transReport.projectId}/configuration/transcript`, {
          method: 'post',
          body: json(transReport.toDto()),
        });
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async deleteReport(configId, projectId) {
    try {
      const response = await this.apiHttp
        .fetch(`projects/${projectId}/configuration/${configId}`, {
          method: 'DELETE',
        });
      this.errorHandler.checkStatus(response);
      return true;
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }
}
