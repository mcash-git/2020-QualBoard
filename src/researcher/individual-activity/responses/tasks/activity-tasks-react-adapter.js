/* eslint-disable react/jsx-filename-extension */
import { noView, bindable } from 'aurelia-framework';
import React from 'react';
import ReactDOM from 'react-dom';
import { MediaClient } from '2020-media';
import { Provider } from 'react-redux';
import { ViewState } from 'shared/app-state/view-state';
import ActivityTasksContainer from './activity-tasks-container';

@noView
export class ActivityTasksReactAdapter {
  static inject = [
    Element,
    'store',
    ViewState,
    MediaClient,
  ];

  constructor(
    element,
    store,
    viewState,
    mediaClient,
  ) {
    this.element = element;
    this.store = store;
    this.viewState = viewState;
    this.mediaClient = mediaClient;
  }

  @bindable projectId;
  @bindable iaId;

  attached() {
    this.render();
  }

  render() {
    const reactElement = (
      <Provider store={this.store}>
        <ActivityTasksContainer
          projectId={this.projectId}
          iaId={this.iaId}
          viewState={this.viewState}
          mediaClient={this.mediaClient}
        />
      </Provider>
    );
    ReactDOM.render(reactElement, this.element);
  }

  detached() {
    ReactDOM.unmountComponentAtNode(this.element);
  }
}
