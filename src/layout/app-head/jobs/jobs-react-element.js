/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { bindable, noView } from 'aurelia-framework';
import { Api } from 'api/api';
import Jobs from './jobs-container.jsx';
import { OidcWrapper } from 'shared/auth/oidc-wrapper';

@noView()
export class JobsReactElement {
  static inject = [Element, Api, OidcWrapper, 'store'];

  reactComponent = {};

  constructor(element, api, oidcWrapper, store) {
    this.element = element;
    this.aureliaDependencies = {
      api,
      oidcWrapper,
    }
    this.store = store;
  }

  render() {
    const reactElement = (
      <Provider store={this.store}>
        <Jobs aureliaDependencies={this.aureliaDependencies} />
      </Provider>
    );
    this.reactComponent = ReactDOM.render(reactElement, this.element);
  }

  attached() {
    this.render();
  }

  detached() {
    ReactDOM.unmountComponentAtNode(this.element);
  }
}
