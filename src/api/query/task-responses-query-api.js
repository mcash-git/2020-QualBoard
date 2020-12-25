import { HttpClient } from 'aurelia-fetch-client';
import { AppConfig } from 'app-config';
import { ErrorHandler } from 'api/error-handler';

export class TaskResponsesQueryApi {
  // TODO: When mock data is no longer needed, remove the reference to the generic HttpClient inject
  static inject() {
    return [HttpClient, 'QbApiHttpClient', AppConfig, ErrorHandler];
  }

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

  async getForUser(query) {
    try {
      let url = `${query.projectId}/activities/${query.iaId}/tasks/${query.taskId}/responses/user/${query.userId}`;
      if (query.repetitionId) { url = `${url}?repetitionId=${query.repetitionId}`; }

      const response = await this.apiHttp.fetch(url);

      this.errorHandler.checkStatus(response);
      const responses = await response.json();
      return query.repetitionId ?
        responses.filter(r => r.repetitionId === query.repetitionId) :
        responses;
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async getForTask({ projectId, iaId, taskId }) {
    try {
      const response = await this.apiHttp
        .fetch(`${projectId}/activities/${iaId}/tasks/${taskId}/details?includeResponses=true`);

      const task = await response.json();

      return task.taskResponses;
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }
}
