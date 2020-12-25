import { HttpClient, json } from 'aurelia-fetch-client';
import { Container } from 'aurelia-dependency-injection';
import { MediaConfig } from '2020-media';
import { AppConfig } from 'app-config';
import { RecentItems } from 'shared/recent-items';
import { ErrorHandler } from 'api/error-handler';

export class ProjectsQueryApi {
  // TODO: When mock data is no longer needed, remove the reference to the generic HttpClient inject
  static inject = [
    HttpClient,
    'QbApiHttpClient',
    AppConfig,
    ErrorHandler,
    Container,
    MediaConfig,
  ];

  constructor(http, apiHttp, appConfig, errorHandler, container, mediaConfig) {
    http.configure(c => { c.useStandardConfiguration(); });
    apiHttp.baseUrl += 'projects/';

    this.apiHttp = apiHttp;
    this.http = http;
    this.appConfig = appConfig;
    this.errorHandler = errorHandler;
    this.container = container;
    this.mediaConfig = mediaConfig;
  }

  async allProjects(query) {
    try {
      const response = await this.apiHttp
        .fetch(`${this.buildQuery(query)}`);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  buildQuery(query) {
    let queryString = '?';
    Object.entries(query).forEach(([key, value]) => {
      queryString += `${key}=${value}&`;
    });

    return queryString;
  }

  async get(id) {
    try {
      const response = await this.apiHttp.fetch(`${id}/overview`);
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async events(id) {
    try {
      const response = await this.apiHttp.fetch(`${id}/dash`);
      this.errorHandler.checkStatus(response);
      this.recentItems.update();
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  // TODO:  Maybe add some fallbacks.
  async participantDashboard() {
    try {
      const response = await this.apiHttp.fetch('participant-dash');
      this.errorHandler.checkStatus(response);
      this.recentItems.update();
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async moderatorDashboard() {
    try {
      const response = await this.apiHttp.fetch('moderator-dash');
      this.errorHandler.checkStatus(response);
      this.recentItems.update();
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async observerDashboard() {
    try {
      const response = await this.apiHttp.fetch('observer-dash');
      this.errorHandler.checkStatus(response);
      this.recentItems.update();
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async getParticipantOverview(id) {
    try {
      const response = await this.apiHttp.fetch(`${id}/participant-overview`);
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async getParticipantFilters(id) {
    try {
      const response = await this.apiHttp
        .fetch(`${id}/participant-filters`);
      this.errorHandler.checkStatus(response);
      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  async getFilteredParticipantMedia(filterModelDto, shouldGetAllIds = false) {
    try {
      const query = (shouldGetAllIds) ?
        'onlyAssetIds=true' :
        buildPaginationQueryString(filterModelDto);
      const response = await this.apiHttp
        .fetch(`${filterModelDto.projectId}/participant-media?${query}`, {
          method: 'post',
          body: json(filterModelDto),
        });
      this.errorHandler.checkStatus(response);

      if (!response.ok) {
        // TODO: robust error handling and appropriate logging
        console.error(
          'Received an error response from media API server:', // eslint-disable-line
          response,
        );
        return null;
      }

      return response.json();
    } catch (e) {
      this.errorHandler.handleError(e);
      return null;
    }
  }

  get recentItems() {
    if (!this._recentItems) {
      this._recentItems = this.container.get(RecentItems);
    }

    return this._recentItems;
  }
}

function buildPaginationQueryString(filterModelDto) {
  return `page=${filterModelDto.page}&pageSize=${filterModelDto.pageSize}`;
}
