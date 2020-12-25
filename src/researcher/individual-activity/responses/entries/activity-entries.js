import { computedFrom, observable } from 'aurelia-framework';
import moment from 'moment-timezone';
import { enums } from '2020-qb4';
import { AssetTypes } from '2020-media';
import { AnnotationsClient } from '2020-annotations';
import { DialogService } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Api } from 'api/api';
import { ViewState } from 'shared/app-state/view-state';
import { DomainState } from 'shared/app-state/domain-state';
import { CurrentUser } from 'shared/current-user';
import { TaskResponseInsightBag } from 'researcher/models/task-response-insight-bag';
import { VideoInsightBag } from 'researcher/models/video-insight-bag';
import { compareBySortOrder } from 'shared/utility/compare-by-sort-order';
import { TaskResponseInsightReadModel } from 'researcher/models/task-response-insight-model';
import { VideoAssetInsightReadModel } from 'researcher/models/video-asset-insight-model';
import { videoInsightEvents } from 'shared/media/insights/video-insight-ea-events';
import { regexFactory } from 'shared/utility/regex-factory';
import { EntryModel } from './entry-model';
import { events } from './insight-ea-events';

const itemsPerPage = 30;

export class ActivityEntries {
  static inject = [
    Api,
    ViewState,
    DomainState,
    CurrentUser,
    DialogService,
    AnnotationsClient,
    EventAggregator,
  ];

  constructor(
    api,
    viewState,
    domainState,
    currentUser,
    dialogService,
    annotationsClient,
    ea,
  ) {
    this.api = api;
    this.statusFilter = [enums.completionStatuses.complete, enums.completionStatuses.incomplete];
    this.viewState = viewState;
    this.domainState = domainState;
    this.currentUser = currentUser;
    this.dialogService = dialogService;
    this.annotationsClient = annotationsClient;
    this.ea = ea;

    this.pageNumber = 1;
  }

  insightBags = [];
  @observable selectedEntry;

  async activate(params) {
    this.projectId = params.projectId;
    this.iaId = params.iaId;
    await this.loadEntries(this.pageNumber);

    const childState = this.viewState.childStateStack.current;

    childState.fullHeight = true;
    childState.actionBarModel.subViewModel = 'researcher/individual-activity/responses/entries/activity-entries-action-bar';
    childState.actionBarModel.subModel = this;
    childState.sidebarModel = this;
    childState.sidebarViewModel = 'researcher/individual-activity/responses/entries/entries-sidebar';

    this.childState = childState;
    this.setSubscriptions();
  }

  attached() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
  }

  unbind() {
    this.disposeSubscriptions();
  }

  setSubscriptions() {
    this.subscriptions = [
      this.ea.subscribe(events.tryAdd, () => this.openSidebar()),
      this.ea.subscribe(
        events.saved,
        (payload) => this.updateTaskResponseInsightBookmark(payload.id),
      ),
      this.ea.subscribe(
        videoInsightEvents.saved,
        (payload) => this.updateVideoInsightBookmark(payload.id, payload.assetId),
      ),
    ];
  }

  disposeSubscriptions() {
    this.subscriptions.forEach(s => s.dispose());
  }

  async loadEntries(pageNumber) {
    const [currentPage, projectUsers] = await Promise.all([
      this.api.query.individualActivities
        .getEntries(
          this.projectId,
          this.iaId, {
            status: [
              enums.completionStatuses.complete.int,
              enums.completionStatuses.started.int,
              enums.completionStatuses.incomplete.int,
              enums.completionStatuses.closedEarly.int,
            ],
            pageSize: itemsPerPage,
            page: pageNumber,
            sort: 'startedOn-desc',
          },
          this.currentUser.userId,
        ),
      this.api.query.projectUsers.getProjectUsers(this.projectId),
    ]);

    currentPage.items.forEach((entry) => {
      const readStatusKeys = Object.keys(entry.readStatuses);
      let userStatus;

      readStatusKeys.forEach(key => {
        if (this.currentUser.userId === key) {
          userStatus = entry.readStatuses[key];
        }
      });
      entry.readStatus = userStatus;
    });

    this.currentPage = currentPage;
    const ia = this.domainState.individualActivity;
    this.individualActivity = ia;
    if (!ia.entryLookup) {
      ia.entryLookup = new Map();
    }
    this.projectUserLookup = new Map(projectUsers.map(p => [p.userId, p]));
    this.entries = currentPage.items
      .map(e => {
        e.repeatUnit = ia.repeatUnit;
        e.participant = this.projectUserLookup.get(e.userId);
        e.timeZone = ia.timeZone;
        return EntryModel.fromDto(e, this.currentUser, this.projectUserLookup);
      });

    this._groupByDate();
  }

  toggleSidebar() {
    this.childState.sidebarOpen = !this.childState.sidebarOpen;
  }

  _groupByDate() {
    const today = moment();
    const yesterday = moment().subtract(1, 'day');

    const dateSortedEntries =
      this.entries.reduce((sorted, entry) => {
        const { startedOn } = entry;

        if (this._isToday(startedOn, today)) {
          sorted.today.push(entry);
        } else if (this._isYesterday(startedOn, yesterday)) {
          sorted.yesterday.push(entry);
        } else if (this._isWeek(startedOn, today)) {
          sorted.week.push(entry);
        } else {
          sorted.older.push(entry);
        }

        return sorted;
      }, {
        today: [], yesterday: [], week: [], older: [],
      });

    if (this._checkForExistingEntries()) {
      this._pushEntries(dateSortedEntries);
    } else {
      this.entriesByDate = dateSortedEntries;
    }
  }

  _checkForExistingEntries() {
    if (this.entriesByDate &&
      (this.entriesByDate.today.length > 0 ||
      this.entriesByDate.yesterday.length > 0 ||
      this.entriesByDate.week.length > 0 ||
      this.entriesByDate.older.length > 0
      )
    ) {
      return true;
    }
    return false;
  }

  _pushEntries(dateSortedEntries) {
    const keys = Object.keys(dateSortedEntries);
    keys.forEach((key) => {
      dateSortedEntries[key].forEach((entry) => {
        this.entriesByDate[key].push(entry);
      });
    });
  }

  async fetchMoreEntries() {
    if (this.pageNumber !== this.currentPage.totalPages
      && this.pageNumber < this.currentPage.totalPages) {
      this.pageNumber += 1;
      await this.loadEntries(this.pageNumber);
    }
  }

  openSidebar() {
    this.childState.sidebarOpen = true;
  }

  closeSidebar() {
    this.childState.sidebarOpen = false;
  }

  handleTasksLoaded(event) {
    const { tasks } = event.detail;

    this.getInsightsForTasks(tasks);
  }

  async getInsightsForTasks(tasks) {
    const allResponses = extractResponsesFromTasksInDomOrder(tasks);
    this.responseLookup = new Map(allResponses.map(r => [r.id, r]));
    this.responseOrderLookup = createResponseOrderLookup(allResponses);

    const allMediaItems = extractMediaItemsFromResponses(allResponses);
    this.mediaItemLookupByAssetId =
      new Map(allMediaItems.map((mi) => [mi.mediaItem.assetId, mi.mediaItem]));
    this.responseLookupByAssetId =
      new Map(allMediaItems.map((mi) => [mi.mediaItem.assetId, mi.response]));

    const specificResourceIris = getAllSpecificResourceIris(allResponses, this.projectId);

    const annotations =
      await this.annotationsClient.searchBySpecificResources(specificResourceIris);

    this.insightBags = annotations
      .map(this._parseCorrectInsightBag.bind(this))
      .sort(this.compareInsightsByDomOrderForSort.bind(this));

    this.insightBags
      .filter(ic => ic.assetId)
      .forEach(ic => {
        this.mediaItemLookupByAssetId.get(ic.assetId).insertInsightSorted(ic);
      });

    this.ea.publish(events.scrollToTop);
  }

  updateTaskResponseInsightBookmark(id) {
    setTimeout(async () => {
      const annotation = await this.annotationsClient.getAnnotation(id);

      const insight = this.insightBags.find(ic => ic.isNew || ic.readModel.id === id);
      if (!insight) {
        console.error('unable to find insight to update it.');
      } else {
        insight.readModel = TaskResponseInsightReadModel.fromAnnotation(
          annotation,
          this.projectUserLookup, this.responseLookup, this.currentUser.timeZone,
        );
        this.ea.publish(`${events.updated}:${insight.eventAggregatorSuffix}`);
        this.ea.publish(events.updated);
      }
    }, 300);
  }

  updateVideoInsightBookmark(id, assetId) {
    setTimeout(async () => {
      const annotation = await this.annotationsClient.getAnnotation(id);
      const mediaItem = this.mediaItemLookupByAssetId.get(assetId);

      let insight = this.insightBags.find(ic => ic.isNew || ic.readModel.id === id);

      if (!insight) {
        insight = mediaItem.insightBags.find(ic => ic.isNew || ic.readModel.id === id);
        this.insertInsightSorted(insight);
      }

      if (!insight) {
        console.error('unable to find insight to update it.');
      } else {
        insight.readModel = VideoAssetInsightReadModel.fromAnnotation(
          annotation,
          this.projectUserLookup, this.currentUser.timeZone,
        );
        this.ea.publish(`${videoInsightEvents.updated}:${insight.eventAggregatorSuffix}`);
        this.ea.publish(videoInsightEvents.updated);
      }
    }, 300);
  }

  insertInsightSorted(insight) {
    let index = 0;
    while (index < this.insightBags.length &&
      this.compareInsightsByDomOrderForSort(insight, this.insightBags[index]) > 0) {
      index++;
    }
    this.insightBags.splice(index, 0, insight);
  }

  insightHoverStart(event, insightElementIndex) {
    const { insight } = event.detail;

    if (insight.response && insight.response.id) {
      this._handleResponseInsightHoverStart(insight);
    } else if (insight.assetId) {
      this._handleMediaItemInsightHoverStart(insight);
    }

    this.ea.publish(events.endHighlightAnimation, { index: insightElementIndex });
  }

  _handleResponseInsightHoverStart(insight) {
    const responseElement = document.getElementById(insight.response.id);

    if (!responseElement) {
      console.warn('response not found');
      return;
    }

    responseElement.classList.add('task-response-insight-hover');
  }

  _handleMediaItemInsightHoverStart(insight) {
    const assetThumbnailElement = document.getElementById(insight.assetId);

    if (!assetThumbnailElement) {
      console.warn('asset thumbnail not found');
      return;
    }

    assetThumbnailElement.classList.add('media-item-insight-hover');
  }

  insightHoverEnd(event) {
    const { insight } = event.detail;

    if (insight.response && insight.response.id) {
      this._handleResponseInsightHoverEnd(insight);
    } else if (insight.assetId) {
      this._handleMediaItemInsightHoverEnd(insight);
    }
  }

  _handleResponseInsightHoverEnd(insight) {
    const responseElement = document.getElementById(insight.response.id);

    if (!responseElement) {
      console.warn('response not found');
      return;
    }

    responseElement.classList.remove('task-response-insight-hover');
  }

  _handleMediaItemInsightHoverEnd(insight) {
    const assetThumbnailElement = document.getElementById(insight.assetId);

    if (!assetThumbnailElement) {
      console.warn('asset thumbnail not found');
      return;
    }

    assetThumbnailElement.classList.remove('media-item-insight-hover');
  }

  compareInsightsByDomOrderForSort(a, b) {
    const aResponse = a.response || this.responseLookupByAssetId.get(a.assetId);
    const bResponse = b.response || this.responseLookupByAssetId.get(b.assetId);

    const aDomOrder = this.responseOrderLookup.get(aResponse.id);
    const bDomOrder = this.responseOrderLookup.get(bResponse.id);

    if (aDomOrder !== bDomOrder) {
      return aDomOrder - bDomOrder;
    }

    // B is media item, A is response
    if (a.response && !b.response) {
      return -1;
    }

    if (b.response && !a.response) {
      return 1;
    }

    // return in order of media item order

    if (a.assetId && b.assetId) {
      const aIndex = aResponse.mediaItems.findIndex((mi) => mi.assetId === a.assetId);
      const bIndex = bResponse.mediaItems.findIndex((mi) => mi.assetId === b.assetId);

      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
    }

    // both insights are on the same response, order by most recently created

    return b.createdOn.diff(a.createdOn);
  }

  _isToday(date, today = moment()) {
    return moment(date).isSame(today, 'day');
  }

  _isYesterday(date, yesterday = moment().subtract(1, 'day')) {
    return date.isSame(yesterday, 'day');
  }

  _isWeek(date, today = moment()) {
    return date.isSame(today, 'week');
  }

  _parseCorrectInsightBag(annotation) {
    const target = annotation.targets.get()[0];

    const taskResponseMatch = regexFactory.getTaskResponseInsightIriRegex().exec(target.iri);
    const assetMatch = regexFactory.getVideoInsightIriRegex().exec(target.iri);

    if (taskResponseMatch) {
      const [, , responseId] = taskResponseMatch;
      return new TaskResponseInsightBag({
        readModel: TaskResponseInsightReadModel
          .fromAnnotation(
            annotation,
            this.projectUserLookup,
            this.responseLookup,
            this.currentUser.timeZone,
          ),
        writeModel: null,
        response: this.responseLookup.get(responseId),
        isNew: false,
      });
    }

    if (assetMatch) {
      const [, , assetId] = assetMatch;
      const mediaItem = this.mediaItemLookupByAssetId.get(assetId);
      if (AssetTypes[mediaItem.type].value === 'Video') {
        return new VideoInsightBag({
          readModel: VideoAssetInsightReadModel.fromAnnotation(
            annotation,
            this.projectUserLookup,
            this.currentUser.timeZone,
          ),
          writeModel: null,
          isNew: false,
          assetId,
        });
      }

      throw new Error('Only video assets are supported for media annotations.');
    }

    throw new Error('Unknown insight type - IRI did not match any asset IRI regex');
  }

  @computedFrom('selectedEntry')
  get shouldEnableInsightsPanel() {
    return !!this.selectedEntry;
  }
}

function extractResponsesFromTasksInDomOrder(tasks) {
  return tasks
    .sort(compareBySortOrder)
    .reduce((responses, task) => responses.concat(getTaskResponsesInDomOrder(task)), []);

  function getResponseResponsesInDomOrder(response) {
    return [response, ...response.responses];
  }

  function getTaskResponsesInDomOrder(task) {
    return [
      task.response,
      ...task.response.responses.reduce((responses, response) =>
        responses.concat(getResponseResponsesInDomOrder(response)), []),
    ];
  }
}

function createResponseOrderLookup(allResponses) {
  return allResponses.reduce((lookup, response, i) => {
    lookup.set(response.id, i);
    return lookup;
  }, new Map());
}

function getAllSpecificResourceIris(responses, projectId) {
  return responses.reduce((iris, response) => {
    iris.push(`qb:/projects/${projectId}/task-responses/${response.id}`);
    return [
      ...iris,
      ...response.mediaItems.map(m => `qb:/projects/${projectId}/video/${m.assetId}`),
    ];
  }, []);
}

function extractMediaItemsFromResponses(allResponses) {
  return allResponses.reduce((mediaItems, response) =>
    mediaItems.concat(response.mediaItems.map((mi) => ({ mediaItem: mi, response }))), []);
}
