import { HttpClient, json } from 'aurelia-fetch-client';

export class EventParticipantsCommandApi {
  static inject = [HttpClient, 'QbApiHttpClient'];

  constructor(http, apiHttp) {
    apiHttp.baseUrl += 'projects/';
    this.http = http;
    this.toggle = true;
    this.apiHttp = apiHttp;
  }

  async addMultiple(command) {
    const response = await this.apiHttp
      .fetch(`${command.projectId}/activities/${command.eventId
      }/participants`, {
        method: 'post',
        body: json(command.userIds),
      });
    return response.json();
  }

  async activateMultiple(command) {
    const response = await this.apiHttp
      .fetch(`${command.projectId}/activities/${command.eventId
      }/participants/activate`, {
        method: 'post',
        body: json(command.userIds),
      });
    return response.json();
  }

  async deactivateMultiple(command) {
    const response = await this.apiHttp
      .fetch(`${command.projectId}/activities/${command.eventId
      }/participants/deactivate`, {
        method: 'post',
        body: json(command.userIds),
      });
    return response.json();
  }

  async deleteMultiple(command) {
    const response = await this.apiHttp
      .fetch(`${command.projectId}/activities/${command.eventId
      }/participants/delete`, {
        method: 'post',
        body: json(command.userIds),
      });
    return response.json();
  }
}
