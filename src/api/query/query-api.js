import { AccountsQueryApi } from './accounts-query-api';
import { ProjectsQueryApi } from './projects-query-api';
import { EventsQueryApi } from './events-query-api';
import { ProjectUsersQueryApi } from './project-users-query-api';
import { IndividualActivitiesQueryApi } from './individual-activities-query-api';
import { TaskResponsesQueryApi } from './task-responses-query-api';
import { NavigationQueryApi } from './navigation-query-api';
import { GroupTagsQueryApi } from './group-tags-query-api';
import { MediaQueryApi } from './media-query-api';
import { EventParticipantsQueryApi } from './event-participants-query-api';
import { ReportingQueryApi } from './reporting-query-api';
import { JobsQueryApi } from './jobs-query-api';

export class QueryApi {
  static inject = [
    AccountsQueryApi,
    ProjectsQueryApi,
    EventsQueryApi,
    ProjectUsersQueryApi,
    IndividualActivitiesQueryApi,
    TaskResponsesQueryApi,
    NavigationQueryApi,
    GroupTagsQueryApi,
    MediaQueryApi,
    EventParticipantsQueryApi,
    ReportingQueryApi,
    JobsQueryApi,
  ];

  constructor(
    accounts,
    projects,
    events,
    projectUsers,
    individualActivities,
    taskResponses,
    navigation,
    groupTags,
    media,
    eventParticipants,
    reporting,
    jobs,
  ) {
    this.accounts = accounts;
    this.projects = projects;
    this.events = events;
    this.projectUsers = projectUsers;
    this.individualActivities = individualActivities;
    this.taskResponses = taskResponses;
    this.navigation = navigation;
    this.groupTags = groupTags;
    this.media = media;
    this.eventParticipants = eventParticipants;
    this.reporting = reporting;
    this.jobs = jobs;
  }
}
