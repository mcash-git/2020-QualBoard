import { HttpClient } from 'aurelia-fetch-client';
import { makeQueryString } from 'shared/utility/make-query-string';
import { AppConfig } from 'app-config';
import { ErrorHandler } from 'api/error-handler';

export class IndividualActivitiesQueryApi {
  static inject = [HttpClient, 'QbApiHttpClient', AppConfig, ErrorHandler];

  constructor(http, apiHttp, appConfig, errorHandler) {
    http.configure(c => {
      c.useStandardConfiguration();
    });
    apiHttp.baseUrl += 'projects/';

    this.apiHttp = apiHttp;
    this.appConfig = appConfig;
    this.http = http;
    this.errorHandler = errorHandler;
  }

  async get(projectId, id) {
    try {
      return await (await this.apiHttp
        .fetch(`${projectId}/activities/${id}/overview`)
        .then(this.errorHandler.checkStatus)
      ).json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async getParticipantOverview(projectId, iaId) {
    try {
      const response = await this.apiHttp
        .fetch(`${projectId}/activities/${iaId}/participant-activity-overview`);
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async getParticipantEntry(projectId, iaId, entryId = null) {
    let url = `${projectId}/activities/${iaId}/participant-entry-overview`;
    if (entryId !== null) {
      url = `${url}?repetitionId=${entryId}`;
    }
    try {
      const response = await this.apiHttp.fetch(url);
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async getNextTaskDetails(projectId, iaId) {
    try {
      const response = this.apiHttp
        .fetch(`${projectId}/activities/${iaId}/participant-entry-overview?onlyNextTask=true`);
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async getTasks(projectId, iaId, includeResponses = false) {
    try {
      const response = await this.apiHttp
        .fetch(`${projectId}/activities/${iaId}/tasks?includeResponses=${includeResponses}`);
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async getTaskSummaries(projectId, iaId) {
    try {
      const response = await this.apiHttp
        .fetch(`${projectId}/activities/${iaId}/task-summaries`);
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async getParticipantEntries(projectId, iaId) {
    try {
      const response = await this.apiHttp
        .fetch(`${projectId}/activities/${iaId}/participant/repetitions`);
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async getEntries(projectId, iaId, options) {
    const qs = makeQueryString(options);
    try {
      const url = `${projectId}/activities/${iaId}/repetitions${qs}`;
      const response = await this.apiHttp.fetch(url);
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async getEntry(projectId, iaId, repetitionId) {
    try {
      const url = `${projectId}/activities/${iaId}/repetitions/${repetitionId}`;
      const response = await this.apiHttp.fetch(url);
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }
}
