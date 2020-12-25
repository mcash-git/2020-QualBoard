import { computedFrom, observable } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import {
  MessagingClient,
  EmailRequest,
  TemplateModel,
  enums as messagingEnums,
} from '2020-messaging';
import { Api } from 'api/api';
import { growlProvider } from 'shared/growl-provider';
import { DateTimeService } from 'shared/components/date-time-service';
import { CurrentUser } from 'shared/current-user';
import { DomainState } from 'shared/app-state/domain-state';
import { mapUserToRecipientModel }
  from 'shared/utility/map-user-to-recipient-model';
import defaultTemplateWrapper from
  'shared/default-email-template-wrapper.html';
import defaultTemplateBodyWrapper from
  'shared/default-email-template-body-wrapper.html';
import loginInstructionsTemplate from
  'shared/login-instructions-template.html';

const MessageTypes = messagingEnums.messageTypes;

export class CreateMessageModal {
  static inject = [
    DialogController,
    Api,
    MessagingClient,
    DateTimeService,
    CurrentUser,
    DomainState,
  ];

  constructor(
    modalController,
    api,
    messaging,
    dateTimeService,
    user,
    domainState,
  ) {
    this.modalController = modalController;
    this.api = api;
    this.messaging = messaging;
    this.dateTimeService = dateTimeService;
    this.defaultSenderQualboard = {};
    this.user = user;
    this.domainState = domainState;
  }

  @observable messageText = '';
  @observable template;
  tabs = ['Write', 'Preview'];

  async canActivate({
    projectId = null,
    accountId = null,
    users = null,
    allUsers = null,
  } = {}) {
    validate();

    this.projectId = projectId;

    // TODO:  When we support other events, this property will change:
    this.event = this.domainState.individualActivity;
    this.project = this.domainState.project;
    this.allUsers = allUsers;

    const requestPromise = this.messaging.templates.get({
      projectId,
      accountId: accountId || this.project.accountId,
      type: MessageTypes.email,
    });

    this.model = new EmailRequest({
      projectId,
      issuingUserId: this.user.userId,
      from: `project-${this.projectId}@2020identity.com`,
      redirectAfterLogin: window.location.origin,
      templatePairs: this._getTemplatePairs(),
      addLogin: true,
    });

    this.users = users;
    const moderators = await this.api.query.projectUsers
      .getProjectUsers(projectId, 0);
    this.moderators = moderators;
    this.fromDisplay = moderators && moderators.length ?
      moderators[0] :
      this.defaultSenderQualboard;
    this.templates = await requestPromise;

    // HACK:  Right now we don't have a good way to filter out the event-level
    // templates, but it doesn't make sense to show them on the project level,
    // so for now we filter them out this way:
    if (!this.event) {
      this.templates = this.templates
        .filter(t => !t.title.toLowerCase().includes('event'));
    }

    this._setDefaultTemplate();
    this.template = this.defaultTemplate;

    this._setUpTabs();
    return true;

    // helper functions

    function validate() {
      if (projectId === null) {
        throw new Error('Cannot activate CreateMessageModal without projectId');
      }
      if (users === null || users.length === 0) {
        throw new Error('Cannot activate CreateMessageModal without users');
      }
    }
  }

  templateChanged(newValue, oldValue) {
    if (newValue === oldValue) {
      return;
    }
    this.model.template = newValue;

    if (oldValue === undefined) {
      return;
    }

    if (newValue === this.defaultTemplate) {
      this.tabs.splice(0, 0, 'Write');
    } else {
      this.tabs.splice(0, 1);
      this.selectTab(this.tabs[0]);
    }
  }

  async send() {
    this.model.recipients = this.users.map(mapUserToRecipientModel);
    this.model.fromDisplayName =
      this.fromDisplay === this.defaultSenderQualboard ?
        'QualBoard' :
        `${this.fromDisplay.firstName} ${this.fromDisplay.lastName}`;

    if (this.model.template === this.defaultTemplate) {
      this.defaultTemplate.body = buildDefaultTemplateBody(this.messageText);
    }

    const success = await this.messaging.emails.create(this.model);

    if (!success) {
      growlProvider('Error', 'There was an error sending the message to users.  Please try again.  If the problem persists, please contact support.');
      return;
    }

    this.modalController.close();
  }

  selectTab(tab) {
    if (tab === this.selectedTab) {
      return;
    }

    this.selectedTab = tab;
  }

  @computedFrom('model.template', 'messageText', 'model.addLogin')
  get previewHtml() {
    return this.model.template === this.defaultTemplate ?
      buildPreviewForDefaultTemplate(this.messageText, this.model.addLogin) :
      buildPreview(this.model);
  }

  _setDefaultTemplate() {
    this.defaultTemplate = new TemplateModel({
      wrapper: defaultTemplateWrapper,
      wrapperBodyInsertionKey: '###body###',
    });
  }

  _setUpTabs() {
    [this.selectedTab] = this.tabs;
  }

  _getTemplatePairs() {
    const formatDateTime = dt =>
      this.dateTimeService
        .fromUtc(dt, this.project.timeZone, 'MM/DD/YYYY h:mm A');

    const templatePairs = {
      '###project-start-date###': formatDateTime(this.project.openTime),
      '###project-end-date###': formatDateTime(this.project.closeTime),
      '###project-name###': this.project.publicName,
      '###url###': window.location.origin,
    };

    if (this.event) {
      templatePairs['###start-date###'] = formatDateTime(this.event.openTime);
      templatePairs['###end-date###'] = formatDateTime(this.event.closeTime);
      templatePairs['###event-name###'] = this.event.publicName;
    }

    return templatePairs;
  }
}

function buildPreview(emailRequest) {
  let { body } = emailRequest.template;

  if (emailRequest.addLogin) {
    body += loginInstructionsTemplate;
  }

  return emailRequest.template.wrapper
    .replace(emailRequest.template.wrapperBodyInsertionKey, body);
}

function buildPreviewForDefaultTemplate(body, shouldAppendLogin) {
  let wrappedBody = buildDefaultTemplateBody(body);

  if (shouldAppendLogin) {
    wrappedBody += loginInstructionsTemplate;
  }

  return defaultTemplateWrapper
    .replace(/###body###/, wrappedBody);
}

function buildDefaultTemplateBody(body) {
  return defaultTemplateBodyWrapper.replace(/###body###/, body);
}
