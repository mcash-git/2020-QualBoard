import { AccountsCommandApi } from './accounts-command-api';
import { ProjectsCommandApi } from './projects-command-api';
import { TasksCommandApi } from './tasks-command-api';
import { TaskResponsesCommandApi } from './task-responses-command-api';
import { IndividualActivitiesCommandApi } from './individual-activities-command-api';
import { GroupTagsCommandApi } from './group-tags-command-api';
import { EventParticipantsCommandApi } from './event-participants-command-api';
import { ReportsCommandApi } from './reports-command-api';

export class CommandApi {
  static inject = [
    AccountsCommandApi,
    ProjectsCommandApi,
    TasksCommandApi,
    IndividualActivitiesCommandApi,
    TaskResponsesCommandApi,
    GroupTagsCommandApi,
    EventParticipantsCommandApi,
    ReportsCommandApi,
  ];

  constructor(
    accountsCommandApi,
    projectsCommandApi,
    tasksCommandApi,
    individualActivitiesCommandApi,
    taskResponsesCommandApi,
    groupTagsCommandApi,
    eventParticipantsCommandApi,
    reportsCommandApi,
  ) {
    this.accounts = accountsCommandApi;
    this.projects = projectsCommandApi;
    this.individualActivities = individualActivitiesCommandApi;
    this.tasks = tasksCommandApi;
    this.taskResponses = taskResponsesCommandApi;
    this.groupTags = groupTagsCommandApi;
    this.eventParticipants = eventParticipantsCommandApi;
    this.reports = reportsCommandApi;
  }
}
