/* eslint-disable react/jsx-filename-extension */
import { DialogService } from 'aurelia-dialog';
import { MediaClient } from '2020-media';
import { Api } from 'api/api';
import { ViewState } from 'shared/app-state/view-state';
import { growlProvider } from 'shared/growl-provider';
import { bindable, noView } from 'aurelia-framework';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ClipsContainer } from './clips-container';

@noView
export class ClipsReactAdapter {
  static inject = [
    Element,
    Api,
    MediaClient,
    ViewState,
    DialogService,
    'store',
  ];

  constructor(
    element,
    api,
    mediaClient,
    viewState,
    dialogService,
    store,
  ) {
    this.element = element;
    this.api = api;
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
        <ClipsContainer
          projectId={this.projectId}
          api={this.api}
          mediaClient={this.mediaClient}
          viewState={this.viewState}
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
