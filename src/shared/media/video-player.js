import { bindable, bindingMode, computedFrom, noView } from 'aurelia-framework';
import videojs from '2020-videojs-annotations';

const defaultVideojsOptions = {
  controlBar: {
    volumePanel: {
      inline: false,
    },
  },
};

@noView
export class VideoPlayer {
  static inject = [Element];
  
  constructor(element) {
    this.element = element;
    
    this.element.className = 'video-player';
  }
  
  @bindable({ defaultBindingMode: bindingMode.oneWay }) mediaItem;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) asset;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) annotations;
  @bindable isAnnotationsEnabled;

  detached() {
    this._tearDown();
  }

  assetChanged() {
    this._handleChange();
  }

  mediaItemChanged() {
    this._handleChange();
  }
  
  bind() {
    this._init();
  }

  pause() {
    this.player.pause();
  }
  
  addInsight(insight) {
    if (!this.mediaItem.insightBags) {
      throw new Error('Unable to add annotation - "annotations" was not bound, so annotations ' +
        'were not initialized.');
    }
    this.videojsAnnotationsPlugin.addAnnotation(insight);
  }
  
  applyClassToInsight(insight, className) {
    this.videojsAnnotationsPlugin.applyClass(insight, className);
  }
  
  removeClassFromInsight(insight, className) {
    this.videojsAnnotationsPlugin.removeClass(insight, className);
  }
  
  toggleLoopInsight(insight) {
    this.videojsAnnotationsPlugin.toggleLoopAnnotation(insight);
  }
  
  removeInsight(insight) {
    this.videojsAnnotationsPlugin.removeAnnotation(insight);
  }
  
  editInsight(insight) {
    this.videojsAnnotationsPlugin.editAnnotation(insight);
  }
  
  finishEditingInsight() {
    this.videojsAnnotationsPlugin.finishEditingAnnotation();
  }
  
  showInsights() {
    this.videojsAnnotationsPlugin.show();
  }
  
  hideInsights() {
    this.videojsAnnotationsPlugin.hide();
  }
  
  togglePlay() {
    if (this.player.paused()) {
      this.player.play();
    } else {
      this.player.pause();
    }
  }
  
  _handleChange() {
    if (this._isInitialized) {
      this._tearDown();
    }
    
    this._init();
  }
  
  _init() {
    if (this._isInitialized) {
      return;
    }
    
    const videoElement = document.createElement('video');
    videoElement.className = 'video-js vjs-default-skin';
    videoElement.controls = true;
    videoElement.preload = 'auto';
    videoElement.poster = this.thumbnailUrl;
    
    const sourceElement = document.createElement('source');
    sourceElement.src = this.url;
    sourceElement.type = 'video/mp4';
    
    videoElement.appendChild(sourceElement);
    
    this.element.appendChild(videoElement);
    
    this.videoElement = videoElement;
    
    const videojsOptions = { ...defaultVideojsOptions };
    
    if (this.isAnnotationsEnabled) {
      videojsOptions.plugins = {
        annotationsPlugin: {
          annotations: this.mediaItem.insightBags,
        },
      };
  
      this.player = videojs(this.videoElement, videojsOptions);
  
      this.videojsAnnotationsPlugin = this.player.annotationsPlugin();
    } else {
      this.player = videojs(this.videoElement, videojsOptions);
    }
    
    this._isInitialized = true;
  }
  
  _tearDown() {
    if (!this._isInitialized) {
      return;
    }
    
    this.player.dispose();
  
    this._isInitialized = false;
  }

  @computedFrom('asset', 'mediaItem')
  get thumbnailUrl() {
    return (this.mediaItem || this.asset).thumbnailUrl;
  }

  @computedFrom('asset', 'mediaItem')
  get url() {
    return (this.mediaItem || this.asset).url;
  }
  
  @computedFrom('videojsAnnotationsPlugin.loopingAnnotation')
  get loopingInsight() {
    // I tried to use `lodash.get` here, but webpack was crapping its pants for some reason.
    return this.videojsAnnotationsPlugin && this.videojsAnnotationsPlugin.loopingAnnotation;
  }
}
