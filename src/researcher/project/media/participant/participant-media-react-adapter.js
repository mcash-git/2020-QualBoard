/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { bindable, noView } from 'aurelia-framework';
import { MediaClient } from '2020-media';
import { DialogService } from 'aurelia-dialog';
import { growlProvider } from 'shared/growl-provider';
import { ViewState } from 'shared/app-state/view-state';
import ParticipantMediaContainer from './participant-media-container';

@noView
export class ParticipantMediaReactAdapter {
  static inject = [
    Element,
    MediaClient,
    ViewState,
    DialogService,
    'store',
  ];

  constructor(
    element,
    mediaClient,
    viewState,
    dialogService,
    store,
  ) {
    this.element = element;
    this.mediaClient = mediaClient;
    this.viewState = viewState;
    this.dialogService = dialogService;
    this.store = store;
  }

  @bindable projectId;

  attached() {
    this.render();
  }

  render() {
    const reactElement = (
      <Provider store={this.store}>
        <ParticipantMediaContainer
          projectId={this.projectId}
          viewState={this.viewState}
          mediaClient={this.mediaClient}
          growlProvider={growlProvider}
          dialogService={this.dialogService}
        />
      </Provider>
    );
    ReactDOM.render(reactElement, this.element);
  }

  detached() {
    ReactDOM.unmountComponentAtNode(this.element);
  }
}
