import { HttpClient, json } from 'aurelia-fetch-client';

export class ProjectsCommandApi {
  static inject() { return [HttpClient, 'QbApiHttpClient']; }

  constructor(http, apiHttp) {
    apiHttp.baseUrl += 'projects/';
    this.http = http;
    this.toggle = true;
    this.apiHttp = apiHttp;
  }

  create(command) {
    const cmd = {
      accountId: command.accountId,
      publicName: command.publicName,
      privateName: command.privateName,
      openTime: command.openTime,
      closeTime: command.closeTime,
      timeZone: command.timeZone.utc[0],
    };
    return this.apiHttp.fetch('', {
      method: 'post',
      body: json(cmd),
    }).then(response => response.json());
  }

  setName(command) {
    const cmd = {
      privateName: command.privateName,
      publicName: command.publicName,
    };

    return this.apiHttp.fetch(`${command.id}/set-name`, {
      method: 'post',
      body: json(cmd),
    }).then(response => response.json());
  }

  setSchedule(command) {
    const cmd = {
      timeZone: command.timeZone.utc[0],
      openTime: command.openTime,
      closeTime: command.closeTime,
    };

    return this.apiHttp.fetch(`${command.id}/set-schedule`, {
      method: 'post',
      body: json(cmd),
    }).then(response => response.json());
  }

  setInstructions(command) {
    const cmd = {
      title: command.title,
      text: command.text,
      media: command.media,
    };

    return this.apiHttp.fetch(`${command.id}/set-instructions`, {
      method: 'post',
      body: json(cmd),
    }).then(response => response.json());
  }

  setCloseoutId(command) {
    const cmd = {
      closeoutId: command.closeoutId,
    };

    return this.apiHttp.fetch(`${command.id}/set-closeout`, {
      method: 'post',
      body: json(cmd),
    }).then(response => response.json());
  }

  setNotes(command) {
    const cmd = {
      notes: command.notes,
    };

    return this.apiHttp.fetch(`${command.id}/set-notes`, {
      method: 'post',
      body: json(cmd),
    }).then(response => response.json());
  }
}
