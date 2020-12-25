import { EventAggregator } from 'aurelia-event-aggregator';
import { DialogController, DialogService } from 'aurelia-dialog';
import { Api } from 'api/api';
import { computedFrom } from 'aurelia-framework';
import { BulkImportModel } from '2020-aurelia-bulk-import';
import { IdentityClient } from '2020-identity';
import { AppConfig } from 'app-config';
import { ImportUsersModel } from './import-users-model';
import { UserImportModel } from './user-import-model';


// Houses logic used by both the event and project user import modals.
export class ImportUsersModal {
  static inject = [
    Api,
    IdentityClient,
    DialogController,
    DialogService,
    Element,
    EventAggregator,
    AppConfig,
  ];

  constructor(
    api,
    identityClient,
    modalController,
    modalService,
    element,
    eventAggregator,
    appConfig,
  ) {
    this.api = api;
    this.identityClient = identityClient;
    this.modalController = modalController;
    this.modalService = modalService;
    this.element = element;
    this.ea = eventAggregator;
    this.appConfig = appConfig;
  }

  activate(model) {
    this.projectId = model.projectId;
    this.groupTags = model.groupTags;
    this.eventId = model.eventId;

    this.existingProjectUsers = model.existingProjectUsers;
    this.existingEventUsers = model.existingEventUsers;

    this._initializeImportModels();
  }

  attached() {
    this._applyModalClasses();
  }

  importUserClose() {
    this.modalController.cancel();
  }

  async trySaveProjectUsers(users) {
    // Need to _not_ send the same tags again if my request failed after
    // saving tags the first time.
    // TODO:  How do we convey this to the user?  New Tags becomes: 0?  I think I'll
    // handle it simply for now and we can iterate on this later.
    this.importUsersModel.newTags = this.importUsersModel.newTags.filter(t =>
      !t.id);

    if (this.importUsersModel.newTags &&
      this.importUsersModel.newTags.length > 0) {
      const tagSaveResponse = await this.api.command.groupTags.batchCreate({
        projectId: this.projectId,
        newTags: this.importUsersModel.newTags,
      });

      if (tagSaveResponse.error) {
        return false;
      }
    }

    try {
      await this.identityClient.createProjectUsers({
        projectId: this.projectId,
        overwriteBehavior: this.bulkImportModel.mergeStrategy,
        emailOption: 'DoNotSend',
        customRedirectClientUrl: window.location.origin,
        users: users.map(u => new UserImportModel(Object.assign(u, {
          projectId: this.projectId,
        }))),
      });
    } catch (error) {
      console.error('Encountered an error trying to save users:', error);
      return false;
    }

    this.ea.publish('project-users-imported');

    return true;
  }

  async trySaveEventParticipants(users) {
    const wasSuccess = await this.trySaveProjectUsers(users);

    if (!wasSuccess) {
      return false;
    }

    const usersToInvite = await this._filterEventParticipantsToInvite(users);

    if (usersToInvite.length === 0) {
      return true;
    }

    const result = await this.api.command.eventParticipants.addMultiple({
      projectId: this.projectId,
      eventId: this.eventId,
      userIds: usersToInvite.map(u => u.userId),
    });

    if (result.error) {
      return false;
    }

    this.ea.publish('event-users-added');
    return true;
  }

  _initializeImportModels() {
    this.importUsersModel = new ImportUsersModel({
      groupTags: this.groupTags,
    });
    this.bulkImportModel = new BulkImportModel({
      fieldMaps: this.importUsersModel.fieldMaps,
      currentView: 'method-choice',
      tryImport: async users => {
        try {
          return await (this.isEventUserImport ?
            this.trySaveEventParticipants(users) :
            this.trySaveProjectUsers(users));
        } catch (error) {
          return false;
        }
      },
      cancel: () => {
        this.modalController.cancel();
      },
      finish: () => {
        this.modalController.ok();
      },
      beforeParse: () => {
        this.importUsersModel.clean();
      },
      previewViewModel: `shared/components/user-import/import-${
        this.isEventUserImport ? 'event' : 'project'
      }-users-confirmation-summary`,
      templateDownloadURL: `${this.appConfig.identity.identityServerUri}/import-templates/user_import_template.xlsx`,
    });

    // non-standard bulkImportModel fields:
    this.bulkImportModel.importUsersModel = this.importUsersModel;
    this.bulkImportModel.existingProjectUserLookup =
      createUserLookup(this.existingProjectUsers);

    this.bulkImportModel.existingEventUserLookup =
      createUserLookup(this.existingEventUsers);
  }

  async _filterEventParticipantsToInvite(users) {
    const participants = await this.api.query.projectUsers
      .getParticipants(this.projectId);

    const importingUserLookup = users.reduce((lookup, user) => {
      lookup[user.email.toLowerCase()] = user;
      return lookup;
    }, {});

    return participants.filter(u => {
      const email = u.email.toLowerCase();

      const existingEventUser = this.bulkImportModel
        .existingEventUserLookup[email];
      const userBeingImported = importingUserLookup[email];

      return !existingEventUser && userBeingImported;
    });
  }

  _applyModalClasses() {
    this.element.querySelector('compose').classList
      .add('modal-subview-wrapper');
  }

  @computedFrom('bulkImportModel', 'bulkImportModel.currentView')
  get subviewClass() {
    switch (this.bulkImportModel.currentView) {
      case 'error':
        return 'status warning';
      case 'success':
        return 'status success';
      case 'paste':
      case 'define-columns':
        return 'bulk-import';
      default:
        return '';
    }
  }

  @computedFrom('eventId')
  get isEventUserImport() {
    return !!this.eventId;
  }
}

// TODO:  We probably will (maybe already do) need this elsewhere.
// Refactor.
function createUserLookup(users) {
  return users ?
    users.reduce((lookup, user) => {
      lookup[user.email.toLowerCase()] = user;
      return lookup;
    }, {}) :
    {};
}
