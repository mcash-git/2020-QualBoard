/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { noView } from 'aurelia-framework';
import { MediaClient } from '2020-media';
import { DialogService } from 'aurelia-dialog';
import { ViewState } from 'shared/app-state/view-state';
import { AppConfig } from 'app-config';
import ParticipantMediaSidebarContainer from './participant-media-sidebar-container';

@noView
export class ParticipantMediaSidebarReactAdapter {
  static inject = [
    Element,
    MediaClient,
    DialogService,
    ViewState,
    'store',
    AppConfig,
  ];

  constructor(element, mediaClient, dialogService, viewState, store, appConfig) {
    this.element = element;
    this.dialogService = dialogService;
    this.mediaClient = mediaClient;
    this.viewState = viewState;
    this.store = store;
    this.appConfig = appConfig;
  }

  attached() {
    this.render();
  }

  detached() {
    ReactDOM.unmountComponentAtNode(this.element);
  }

  render() {
    const reactElement = (
      <Provider store={this.store}>
        <ParticipantMediaSidebarContainer
          dialogService={this.dialogService}
          mediaClient={this.mediaClient}
          viewState={this.viewState}
          identityServerUri={this.appConfig.identity.identityServerUri}
        />
      </Provider>
    );
    ReactDOM.render(reactElement, this.element);
  }
}
