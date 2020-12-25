import { HttpClient, json } from 'aurelia-fetch-client';

export class TaskResponsesCommandApi {
  static inject = [HttpClient, 'QbApiHttpClient'];

  constructor(http, apiHttp) {
    apiHttp.baseUrl += 'projects/';
    this.http = http;
    this.toggle = true;
    this.apiHttp = apiHttp;
  }

  async create(command) {
    const taskId = command.taskPromptId || command.taskId;
    return (await this.apiHttp.fetch(`${command.projectId}/activities/${
      command.iaId}/tasks/${taskId}/responses`, {
      method: 'post',
      body: json(command),
    })).json();
  }
}
