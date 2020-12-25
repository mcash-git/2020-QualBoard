import { HttpClient } from 'aurelia-fetch-client';

export class EventsQueryApi {
  static inject() { return [HttpClient, 'QbApiHttpClient']; }

  constructor(http, apiHttp) {
    this.http = http;
    this.apiHttp = apiHttp;
  }
}
