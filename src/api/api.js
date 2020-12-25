import { CommandApi } from './command/command-api';
import { QueryApi } from './query/query-api';
import { Insights } from './insights/insights';

export class Api {
  static inject() {
    return [CommandApi, QueryApi, Insights];
  }

  constructor(commandApi, queryApi, insights) {
    this.command = commandApi;
    this.query = queryApi;
    this.insights = insights;
  }
}
