import { HttpClient, json } from 'aurelia-fetch-client';

export class IndividualActivitiesCommandApi {
  static inject = [HttpClient, 'QbApiHttpClient'];

  constructor(http, apiHttp) {
    apiHttp.baseUrl += 'projects/';
    this.http = http;
    this.toggle = true;
    this.apiHttp = apiHttp;
  }

  create(command) {
    // NOTE:  projectId is obtained by the API from the route, not the POST item.
    const cmd = {
      publicName: command.publicName,
      privateName: command.privateName,
      openDateTime: command.openDateTime,
      closeDateTime: command.repeatUnit > 1 ? null : command.closeDateTime,
      timeZone: command.timeZone.utc[0],
      repeatUnit: command.repeatUnit,
      repeatMinimum: command.repeatMinimum,
      repeatMaximum: command.repeatMaximum,
      numberOfRepetitions: command.numberOfRepetitions,
    };

    return this.apiHttp.fetch(`${command.projectId}/activities`, {
      method: 'post',
      body: json(cmd),
    }).then(response => response.json());
  }

  setName(command) {
    const cmd = {
      publicName: command.publicName,
      privateName: command.privateName,
    };

    return this.apiHttp.fetch(`${command.projectId}/activities/${command.id}/set-name`, {
      method: 'post',
      body: json(cmd),
    }).then(response => response.json());
  }

  setIncentive(command) {
    const cmd = {
      incentiveAmount: command.incentiveAmount,
    };

    return this.apiHttp.fetch(`${command.projectId}/activities/${command.id}/set-incentive`, {
      method: 'post',
      body: json(cmd),
    }).then(response => response.json());
  }

  setSchedule(command) {
    const cmd = {
      timeZone: command.timeZone.utc[0],
      openDateTime: command.openTime,
      closeDateTime: command.repeatUnit > 1 ? null : command.closeTime,
      repeatMinimum: command.repeatMinimum || 1,
      repeatMaximum: command.repeatMaximum,
      repeatUnit: command.repeatUnit,
      // NOTE:  The back end throws an error when it receives a null value for
      // this field, so I am arbitrarily setting it to 1 for non-repeating IAs.
      numberOfRepetitions: command.repeatUnit > 1 ? command.numberOfRepetitions : 1,
    };

    return this.apiHttp.fetch(`${command.projectId}/activities/${command.id}/set-schedule`, {
      method: 'post',
      body: json(cmd),
    }).then(response => response.json());
  }

  reorderTasks(command) {
    return this.apiHttp.fetch(`${command.projectId}/activities/${command.iaId}/reorder-tasks`, {
      method: 'post',
      body: json({ taskOrder: command.taskOrder }),
    }).then(response => response.json());
  }

  async createRepetition(command) {
    return (await this.apiHttp.fetch(`${command.projectId}/activities/${
      command.iaId}/participants/${command.userId}/repetitions`, {
      method: 'post',
    })).json();
  }

  async setDefaultModerator(command) {
    const result = await this.apiHttp.fetch(`${command.projectId}/activities/${
      command.iaId}/set-default-moderator`, {
      method: 'post',
      body: json({ defaultModeratorUserId: command.defaultModeratorUserId }),
    });
    return result.json();
  }

  async markEntryAsRead(command) {
    const result =
      await this.apiHttp.fetch(
        `${command.projectId}/activities/${command.iaId}/repetitions/${command.repId}/mark-as-read`,
        {
          method: 'post',
        },
      );

    return result.json();
  }
}
