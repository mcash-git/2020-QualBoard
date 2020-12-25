import { HttpClient, json } from 'aurelia-fetch-client';
import { AppConfig } from 'app-config';
import { GroupTagsQueryApi } from 'api/query/group-tags-query-api';

export class GroupTagsCommandApi {
  static inject = [HttpClient, 'QbApiHttpClient', AppConfig, GroupTagsQueryApi];

  constructor(http, apiHttp, appConfig, groupTagsQueryApi) {
    apiHttp.baseUrl += 'projects/';
    this.http = http;
    this.toggle = true;
    this.apiHttp = apiHttp;
    this.groupTagsQueryApi = groupTagsQueryApi;
  }

  async create(command) {
    return (await this.apiHttp.fetch(`${command.projectId}/add-group-tag`, {
      method: 'post',
      body: json(command),
    })).json();
  }

  async batchCreate(command) {
    const response = await this.apiHttp.fetch(`${command.projectId}/add-group-tags`, { // eslint-disable-line
      method: 'post',
      body: json(command.newTags),
    });

    // then queried and matched, set their ids on the existing objects.
    const unmatched = await this
      ._matchTagsWithSaved(command.projectId, command.newTags);

    if (unmatched.length > 0) {
      const unmatchedAgain = await this._matchTagsWithSaved(command.projectId, unmatched);

      if (unmatchedAgain.length > 0) {
        return {
          error: `There were still ${unmatchedAgain.length} unmatched tags. A manual retry is required.`,
        };
      }
    }

    return {};
  }

  async update(command) {
    return (await this.apiHttp.fetch(`${command.projectId}/rename-group-tag/${command.id}`, {
      method: 'post',
      body: json(command),
    })).json();
  }

  async delete(command) {
    return (await this.apiHttp.fetch(`${command.projectId}/remove-group-tag/${command.id}`, {
      method: 'post',
    })).json();
  }

  async _matchTagsWithSaved(projectId, newTags) {
    const groupTags = await this.groupTagsQueryApi.getGroupTags(projectId);

    const notFound = [];

    newTags.forEach(tag => {
      const saved = groupTags
        .find(t => tag.name.toLowerCase() === t.name.toLowerCase());

      if (!saved) {
        notFound.push(tag);
        return;
      }

      tag.id = saved.id;
    });

    return notFound;
  }
}
