/* eslint-disable react/jsx-filename-extension */
import { bindable, noView } from 'aurelia-framework';
import React from 'react';
import ReactDOM from 'react-dom';
import { VideoInsightClipModalContent } from './video-insight-clip-modal-content';

@noView
export class VideoInsightClipModalReactAdapter {
  static inject = [Element];
  
  constructor(element) {
    this.element = element;
  }
  
  @bindable insight;
  @bindable mediaApiBaseUrl;
  @bindable closeModal;
  @bindable currentUserTimeZone;
  @bindable confirm;
  @bindable saveInsight;
  @bindable removeInsight;
  
  attached() {
    this.render();
  }
  
  // Intentionally left blank.  -Changed() methods won't be called prior to being attached if
  // bind() is defined on a given module.
  bind() {}
  
  insightChanged() {
    this.render();
  }
  
  render() {
    const modalContent = (
      <VideoInsightClipModalContent
        insight={this.insight}
        mediaApiBaseUrl={this.mediaApiBaseUrl}
        currentUserTimeZone={this.currentUserTimeZone}
        closeModal={this.closeModal}
        confirm={this.confirm}
        saveInsight={this.saveInsight}
        removeInsight={this.removeInsight}
      />
    );
    
    this.reactComponent = ReactDOM.render(modalContent, this.element);
  }
  
  detached() {
    ReactDOM.unmountComponentAtNode(this.element);
  }
}
