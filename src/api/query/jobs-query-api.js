import { AppConfig } from 'app-config';
import { ErrorHandler } from 'api/error-handler';

export class JobsQueryApi {
  static inject = ['QbApiHttpClient', AppConfig, ErrorHandler];

  constructor(apiHttp, appConfig, errorHandler) {
    this.apiHttp = apiHttp;
    this.appConfig = appConfig;
    this.errorHandler = errorHandler;
  }

  async getJobs() {
    try {
      const response = await this.apiHttp
        .fetch('jobs?sort=CreatedOn-desc');
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async getJobTempUrl(jobUrl) {
    try {
      const response = await this.apiHttp.fetch(jobUrl);
      this.errorHandler.checkStatus(response);
      return response.text();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }
}
