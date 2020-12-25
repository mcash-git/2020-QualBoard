import { bindable, bindingMode } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Api } from 'api/api';
import { ParticipantTaskResponseModel } from 'shared/components/task-responses/participant-task-response-model';
import { TaskResponseCommentModel } from 'shared/components/task-responses/task-response-comment-model';
import { AppConfig } from 'app-config';
import { eventKeys } from 'shared/events/event-keys';
import { linkParentChildResponses } from 'shared/components/task-responses/task-response-utility';
import { CurrentUser } from 'shared/current-user';

export class TaskResponseBlock {
  static inject = [Api, EventAggregator, AppConfig, CurrentUser];

  constructor(api, ea, appConfig, currentUser) {
    this.api = api;
    this.ea = ea;
    this.appConfig = appConfig;
    this.currentUser = currentUser;
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) task;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) summary;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) projectId;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) userLookup;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) expandTo;

  showResponses = false;

  activate(model) {
    this.task = model.task;
    this.summary = model.summary;
    this.projectId = model.projectId;
  }

  attached() {
    const eventKey = `${eventKeys.taskResponseAdded}:${
      this.task.id}:${this.summary.userId}`;
    this.responseSubscription = this.ea.subscribe(eventKey, async () =>
      setTimeout(() => this.loadUserTaskResponses(), 300));

    if (this.expandTo && this.summary.user.userId === this.expandTo.userId) {
      this.toggleResponses();
    }
  }

  detached() {
    this.responseSubscription.dispose();
  }

  async toggleResponses() {
    if (!this.userTaskResponses) {
      await this.loadUserTaskResponses();
    }
    this.showResponses = !this.showResponses;
  }

  async loadUserTaskResponses() {
    const taskResponses = await this.api.query.taskResponses.getForUser({
      projectId: this.projectId,
      iaId: this.task.individualActivityId,
      userId: this.summary.userId,
      taskId: this.task.id,
    });

    this.userTaskResponses =
      linkParentChildResponses(taskResponses.map((r) => ((r.parentResponseId) ?
        (new TaskResponseCommentModel({
          ...r,
          user: this.userLookup[r.userId],
        }, this.currentUser.timeZone)) :
        (new ParticipantTaskResponseModel({
          ...r,
          user: this.userLookup[r.userId],
          mediaApiUrl: this.appConfig.media.baseUrl,
          imageUriBase: this.appConfig.media.imageUriBase,
        })))));
  }
}
