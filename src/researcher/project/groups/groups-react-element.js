/* eslint-disable*/
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { bindable, noView } from 'aurelia-framework';
import Groups from './groups-react/groups-container.jsx';
import { Api } from 'api/api';
import { ViewState } from 'shared/app-state/view-state';
import { ChildViewState } from 'shared/app-state/child-view-state';
import { IdentityClient } from '2020-identity';
import { DialogService } from 'aurelia-dialog';

@noView()
export class GroupsReactElement {
  @bindable projectId;

  static inject = [Element, Api, ViewState, IdentityClient, DialogService, 'store'];

  constructor(element, api, viewState, identityClient, dialogService, store) {
    this.element = element;
    this.viewState = viewState;
    this.store = store;
    this.aureliaDependencies = {
      api,
      identityClient,
      dialogService,
    };

    this.initializeChildView();
  }

  reactComponent = {};

  initializeChildView() {
    const childViewState = new ChildViewState({
      sidebarOpen: false,
      sidebarViewModel: 'researcher/project/groups/sidebar/groups-sidebar',
      sidebarModel: this,
      actionBarViewModel: 'researcher/project/groups/action-bar/groups-action-bar',
      actionBarModel: {},
    });

    this.aureliaDependencies.childViewState = childViewState;
    this.viewState.childStateStack.push(this.aureliaDependencies.childViewState);
  }

  render() {
    this.reactComponent = ReactDOM.render(<Provider store={this.store}><Groups projectId={this.projectId} aureliaDependencies={this.aureliaDependencies}/></Provider>, this.element);
  }

  attached() {
    this.render();
  }

  detached() {
    ReactDOM.unmountComponentAtNode(this.element);
  }
}
