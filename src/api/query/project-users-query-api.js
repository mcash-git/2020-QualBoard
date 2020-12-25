import { json } from 'aurelia-fetch-client';
import { AppConfig } from 'app-config';
import { ErrorHandler } from 'api/error-handler';

export class ProjectUsersQueryApi {
  static inject = ['QbApiHttpClient', AppConfig, ErrorHandler];

  constructor(apiHttp, appConfig, errorHandler) {
    apiHttp.baseUrl += 'users/';

    this.apiHttp = apiHttp;
    this.appConfig = appConfig;
    this.errorHandler = errorHandler;
  }

  async getModerators(projectId) {
    return this.getProjectUsers(projectId, 0);
  }

  async getResearchAnalysts(projectId) {
    return this.getProjectUsers(projectId, 1);
  }

  async getClientObservers(projectId) {
    return this.getProjectUsers(projectId, 2);
  }

  async getParticipants(projectId) {
    return this.getProjectUsers(projectId, 3);
  }

  async getProjectUsers(projectId, role = null) {
    let query = '';
    if (role !== null) {
      query = `?role=${role}`;
    }
    const resp = await this.apiHttp.fetch(`projects/${projectId}${query}`);
    this.errorHandler.checkStatus(resp);
    return resp.json();
  }

  async getParticipantEventDash(projectId, userId) {
    const response = await this.apiHttp
      .fetch(`${userId}/projects/${projectId}/participant-event-dash`);
    this.errorHandler.checkStatus(response);
    return response.json();
  }

  async getUserIdsFromLogicEngineRules({ projectId, rules }) {
    const response = await this.apiHttp.fetch(`projects/${projectId}/rules`, {
      method: 'post',
      body: json(rules),
    });

    return response.json();
  }
}
