import animate from 'amator';
import { bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Api } from 'api/api';
import { AppConfig } from 'app-config';
import { DomainState } from 'shared/app-state/domain-state';
import { ViewState } from 'shared/app-state/view-state';
import { EntryModel } from 'researcher/individual-activity/responses/entries/entry-model';
import { compareBySortOrder } from 'shared/utility/compare-by-sort-order';
import { CurrentUser } from 'shared/current-user';
import { ParticipantTaskModel } from 'participant/models/participant-task-model';
import { events } from './insight-ea-events';

export class ActivityEntry {
  static inject = [
    Element,
    Api,
    AppConfig,
    DomainState,
    CurrentUser,
    EventAggregator,
    ViewState,
  ];

  constructor(element, api, appConfig, domainState, currentUser, ea, viewState) {
    this.element = element;
    this.api = api;
    this.appConfig = appConfig;
    this.domainState = domainState;
    this.currentUser = currentUser;
    this.ea = ea;
    this.viewState = viewState;
  }

  @bindable projectId;
  @bindable iaId;
  @bindable selectedEntry;
  @bindable insightBags;

  async bind() {
    this.subscriptions = [
      this.ea.subscribe(
        events.scrollToResponse,
        payload => this.scrollToResponseById(payload.responseId),
      ),
    ];

    this.selectedEntryChanged(this.selectedEntry);
  }

  unbind() {
    if (this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => sub.dispose());
    }

    this.subscriptions = [];
  }

  attached() {
    this.scrollHandler = (e) => { this.scrollToResponseById(this.assetLookup[e.detail].id); };
    document.addEventListener('scroll-to-response-with-asset-id', this.scrollHandler);
  }

  detached() {
    document.removeEventListener('scroll-to-response-with-asset-id', this.scrollHandler);
  }

  async selectedEntryChanged(newValue) {
    this.active = false;
    this.entryId = newValue.id;
    await this._fetchEntry();
    this.scrollElement.scrollTop = 0;
  }

  async _fetchEntry() {
    // todo: get all the tasks and use it, so we can hide the ones skipped.
    const [
      { tasks, entryDetails: entryDto },
      projectUsers,
      { tasks: allTasks },
    ] = await Promise.all([
      this.api.query.individualActivities.getEntry(this.projectId, this.iaId, this.entryId),
      this.api.query.projectUsers.getProjectUsers(this.projectId),
      this.api.query.individualActivities.getTasks(this.projectId, this.iaId),
    ]);

    const projectUserLookup = new Map(projectUsers.map(pu => [pu.userId, pu]));

    this.allTasks = allTasks.sort(compareBySortOrder);

    this.taskLookup = this._createTaskLookup({ tasks, projectUserLookup });
    this.assetLookup = this._createAssetIdLookup({ tasks });

    this.element.dispatchEvent(new CustomEvent('tasks-loaded', {
      bubbles: true,
      detail: {
        tasks: Array.from(this.taskLookup.values()),
      },
    }));

    this.tasksWithPlaceholders = fillSkippedTasks({
      allTasks,
      entryTaskLookup: this.taskLookup,
    });

    this.userId = entryDto.userId;
    this.entry = EntryModel.fromDto(entryDto, this.currentUser, projectUserLookup);
    this.projectUserLookup = projectUserLookup;
  }

  _createTaskLookup({
    tasks = null,
    projectUserLookup = null,
  } = {}) {
    return new Map(tasks
      .sort(compareBySortOrder)
      .map(t => [
        t.id,
        ParticipantTaskModel.fromDto(
          t,
          this.appConfig.media.baseUrl,
          this.appConfig.media.imageUriBase,
          this.currentUser.timeZone,
          projectUserLookup,
        ),
      ]));
  }

  _createAssetIdLookup({ tasks }) {
    const assetLookup = {};
    tasks.forEach(t => {
      t.taskResponses.forEach(r => {
        r.media.forEach(m => {
          assetLookup[m.assetId] = r;
        });
      });
    });
    return assetLookup;
  }

  scrollToResponseById(responseId) {
    this.scrollToResponse(document.getElementById(responseId));
  }

  scrollToResponse(responseElement) {
    setTimeout(() => {
      const rect = responseElement.getBoundingClientRect();
      const scrollDiff = rect.top - 270;
      const scrollTop = this.scrollElement.scrollTop + scrollDiff;

      animate(this.scrollElement, { scrollTop }, {});
    }, 200);
  }

  handleScrollToResponse(e) {
    const { responseElement } = e.detail;
    this.scrollToResponse(responseElement);
  }

  async openResponseDrawer(e) {
    const { element, response } = e.detail;
    this.scrollToResponse(element);
    const result = await this.responseDrawer.open({
      parentResponseElement: element,
      parentResponseModel: response,
      canProbe: true,
      scrollFn: () => this.scrollToResponse(element),
      isFullHeightView: true,
    });

    if (result.wasCancelled) {
      return;
    }
    setTimeout(() => {
      this._fetchEntry();
    }, 300);
  }
}

function fillSkippedTasks({
  allTasks = null,
  entryTaskLookup = null,
} = {}) {
  return allTasks.reduce((out, task) => {
    const entryTask = entryTaskLookup.get(task.id);
    if (entryTask) {
      if (out.consecutiveSkippedTasksCount > 0) {
        out.filledTasks.push({ skippedCount: out.consecutiveSkippedTasksCount });
        out.consecutiveSkippedTasksCount = 0;
      }
      out.filledTasks.push(entryTask);
    } else {
      out.consecutiveSkippedTasksCount++;
    }
    return out;
  }, { filledTasks: [], consecutiveSkippedTasksCount: 0 }).filledTasks;
}
