/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { noView } from 'aurelia-framework';
import { MediaClient } from '2020-media';
import { DialogService } from 'aurelia-dialog';
import { growlProvider } from 'shared/growl-provider';
import { ViewState } from 'shared/app-state/view-state';
import ParticipantMediaActionBarContainer from './participant-media-action-bar-container';

@noView
export class ParticipantMediaActionBarReactAdapter {
  static inject = [
    Element,
    MediaClient,
    DialogService,
    ViewState,
    'store',
  ];

  constructor(element, mediaClient, dialogService, viewState, store) {
    this.element = element;
    this.dialogService = dialogService;
    this.mediaClient = mediaClient;
    this.viewState = viewState;
    this.store = store;
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
        <ParticipantMediaActionBarContainer
          dialogService={this.dialogService}
          mediaClient={this.mediaClient}
          growlProvider={growlProvider}
          viewState={this.viewState}
        />
      </Provider>
    );
    ReactDOM.render(reactElement, this.element);
  }
}
