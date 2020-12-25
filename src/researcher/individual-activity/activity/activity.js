import { Api } from 'api/api';
import { Router, activationStrategy } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { AppConfig } from 'app-config';
import { DomainState } from 'shared/app-state/domain-state';
import { compareBySortOrder } from 'shared/utility/compare-by-sort-order';
import { ViewState } from 'shared/app-state/view-state';
import { eventKeys } from 'shared/events/event-keys';
// TODO:  Factor out the common logic, or just copy into another model.
import { ModeratorTaskModel } from './tasks/moderator-task-model';

export class Activity {
  static inject = [Api, Router, AppConfig, DomainState, ViewState, EventAggregator];

  constructor(api, router, appConfig, domainState, viewState, ea) {
    this.api = api;
    this.router = router;
    this.appConfig = appConfig;
    this.domainState = domainState;
    this.viewState = viewState;
    this.ea = ea;
  }

  determineActivationStrategy() {
    return activationStrategy.replace;
  }

  async canActivate(params) {
    this.projectId = params.projectId;
    this.iaId = params.iaId;
    this.expandTo = {
      taskId: params.taskId || null,
      userId: params.userId || null,
      responseId: params.responseId || null,
      followupId: params.followupId || null,
    };

    if (!this.expandTo.taskId) {
      this.expandTo = null;
    }

    this.isExpanded = false;

    const [{ taskSummaries, totalMinimumRepetitions }, projectUsers] = await
      Promise.all([
        this.api.query.individualActivities.getTaskSummaries(this.projectId, this.iaId, true),
        this.api.query.projectUsers.getProjectUsers(params.projectId),
      ]);

    this.projectUserLookup = projectUsers.reduce((out, curr) => {
      out[curr.userId] = curr;
      return out;
    }, {});

    this.tasks = taskSummaries.map((t) => {
      t.userCompletions.forEach(uc => {
        uc.totalMinimumRepetitions = totalMinimumRepetitions;
      });

      return new ModeratorTaskModel({
        ...t,
        projectUserLookup: this.projectUserLookup,
        mediaApiUrl: this.appConfig.media.baseUrl,
        imageUriBase: this.appConfig.media.imageUriBase,
      });
    }).sort(compareBySortOrder);

    return !!this.tasks;
  }

  async activate() {
    this.builderUrl = `/#/projects/${this.projectId
    }/individual-activities/${this.iaId}/edit`;
    this.moderatorId = this.domainState.individualActivity
      .defaultModeratorUserId || '00000000-0000-0000-0000-000000000000';
  }

  async openResponseDrawer(e) {
    const { element, response } = e.detail;
    this.scrollToResponse(element);
    const result = await this.responseDrawer.open({
      parentResponseElement: element,
      parentResponseModel: response,
      canProbe: true,
    });

    if (result.wasCancelled) {
      return;
    }

    this.tasks.find(t => t.id === response.taskPromptId).totalResponses++;
    this.ea.publish(`${eventKeys.taskResponseAdded}:${response.taskPromptId}:${
      response.userId}`);
  }

  async handleScrollToResponse(e) {
    const { responseElement } = e.detail;
    this.scrollToResponse(responseElement);
  }

  scrollToResponse(responseElement) {
    setTimeout(() => {
      this.viewState.scrollIntoView(responseElement);
    }, 200);
  }
}
