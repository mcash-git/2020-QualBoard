import { computedFrom } from 'aurelia-framework';
import { enums } from '2020-qb4';
import { ParticipantTaskResponseModel } from './participant-task-response-model';
import { MediaDescriptorModel } from 'shared/media/media-descriptor-model';
import { compareBySortOrder } from 'shared/utility/compare-by-sort-order';
import { linkParentChildResponses } from 'shared/utility/link-parent-child-responses';

const PromptTypes = enums.promptTypes;
const PlatformLimits = enums.platformLimits;

interface IParticipantTaskModel {
  id?: string | null;
  individualActivityId?: string | null;
  title?: string | null;
  text?: string | null;
  type?: any;
  platformLimit?: any;
  isResponseTextRequired?: boolean | null;
  mediaItems?: any;
  isMediaRequired?: boolean | null;
  autoWrapOptions?: boolean | null;
  minResponseOptions?: number | null;
  maxResponseOptions?: number | null;
  availableOptions?: any;
  matrixColumns?: any;
  matrixRows?: any;
  response?: string | null;
  allResponses?: any;
  sortOrder?: number | null;
  isOptimistic?: boolean | null;
}

export class ParticipantTaskModel implements IParticipantTaskModel {
  public id: string | null;
  public individualActivityId: string | null;
  public title: string | null;
  public text: string | null;
  public type: any;
  public platformLimit: any;
  public isResponseTextRequired: boolean | null;
  public mediaItems: any;
  public isMediaRequired: boolean | null;
  public autoWrapOptions: boolean | null;
  public minResponseOptions: number | null;
  public maxResponseOptions: number | null;
  public availableOptions: any;
  public matrixColumns: any;
  public matrixRows: any;
  public response: string | null;
  public allResponses: any;
  public sortOrder: number | null;
  public isOptimistic: boolean | null;

  constructor(model: IParticipantTaskModel) {
    this.id = model.id || null;
    this.individualActivityId = model.individualActivityId || null;
    this.title = model.title || null;
    this.text = model.text || null;
    this.type = model.type || PromptTypes.text;
    this.platformLimit = model.platformLimit || PlatformLimits.both;
    this.isResponseTextRequired = model.isResponseTextRequired || false;
    this.mediaItems = model.mediaItems || [];
    this.isMediaRequired = model.isMediaRequired || false;
    this.autoWrapOptions = model.autoWrapOptions || false;
    this.minResponseOptions = model.minResponseOptions || 1;
    this.maxResponseOptions = model.maxResponseOptions || null;
    this.availableOptions = model.availableOptions || [];
    this.matrixColumns = model.matrixColumns || [];
    this.matrixRows = model.matrixRows || [];
    this.response = model.response || null;
    this.allResponses = model.allResponses || [];
    this.sortOrder = model.sortOrder || -1;
    this.isOptimistic = model.isOptimistic || false;
  }

  static fromDto(
    dto: any,
    mediaApiUrl: string,
    imageUriBase: string = null,
    userTimeZone: string,
    projectUserLookup: string,
    isOptimistic: boolean = false): ParticipantTaskModel
  {
    const {
      id = null,
      individualActivityId = null,
      title = null,
      text = null,
      type = 0,
      platformLimit = 0,
      responseTextRequired = false,
      media = [],
      mediaRequired = false,
      autoWrapOptions = true,
      minimumOptionsRequired = 1,
      maximumOptionsLimit = null,
      options = [],
      matrixColumns = [],
      matrixRows = [],
      taskResponses = [],
      sortOrder = null,
    } = dto;
    const model = new ParticipantTaskModel({
      id,
      individualActivityId,
      title,
      text,
      type: PromptTypes[type],
      platformLimit: PlatformLimits[platformLimit],
      isResponseTextRequired: responseTextRequired,
      mediaItems: media.map(m => new MediaDescriptorModel({ ...m, mediaApiUrl, imageUriBase })),
      isMediaRequired: mediaRequired,
      autoWrapOptions,
      minResponseOptions: minimumOptionsRequired,
      maxResponseOptions: maximumOptionsLimit,
      availableOptions: options.sort(compareBySortOrder),
      matrixColumns: matrixColumns.sort(compareBySortOrder),
      matrixRows: matrixRows.sort(compareBySortOrder),
      sortOrder,
      isOptimistic,
    });

    const allResponses = taskResponses
      .map(r => ParticipantTaskResponseModel
        .fromDto(
          r,
          model,
          mediaApiUrl,
          imageUriBase,
          userTimeZone,
          projectUserLookup,
        ));
    const parentResponse = linkParentChildResponses(allResponses)[0];

    model.allResponses = allResponses;
    model.response = parentResponse || null;

    return model;
  }

  clone(overwriteProps: any = {}): ParticipantTaskModel {
    return new ParticipantTaskModel({
      id: this.id,
      individualActivityId: this.individualActivityId,
      title: this.title,
      text: this.text,
      type: this.type,
      platformLimit: this.platformLimit,
      isResponseTextRequired: this.isResponseTextRequired,
      isMediaRequired: this.isMediaRequired,
      autoWrapOptions: this.autoWrapOptions,
      minResponseOptions: this.minResponseOptions,
      maxResponseOptions: this.maxResponseOptions,
      response: this.response,
      allResponses: this.allResponses,
      sortOrder: this.sortOrder,
      isOptimistic: this.isOptimistic,
      // TODO:  when these all have proper .clone() methods, use them.
      mediaItems: [...this.mediaItems],
      availableOptions: [...this.availableOptions],
      matrixColumns: [...this.matrixColumns],
      matrixRows: [...this.matrixRows],
      ...overwriteProps,
    });
  }

  setResponses(
    taskResponses: any,
    mediaApiUrl?:string,
    imageUriBase?:string,
    userTimeZone?:string,
    projectUserLookup?: any,
  ) {
    const allResponses = taskResponses.map(r => ParticipantTaskResponseModel.fromDto(
      r,
      this,
      mediaApiUrl,
      imageUriBase,
      userTimeZone,
      projectUserLookup,
      ));
    const response = linkParentChildResponses(allResponses)[0];

    this.allResponses = allResponses || [];
    this.response = response || null;
  }

  receiveResponse(responseModel: any): void {
    this.allResponses = [...this.allResponses, responseModel];
    this.response = linkParentChildResponses(this.allResponses)[0];
  }

  @computedFrom('response')
  get hasResponse() {
    return this.response !== null && this.response !== undefined;
  }
}
