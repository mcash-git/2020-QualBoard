import { customElement, bindable, bindingMode, TaskQueue } from 'aurelia-framework';
import { AppConfig } from 'app-config';
import { froalaDefaultConfig } from './froala/froala-default-config';
import sanitizeUserHtml from '../utility/security/sanitize-user-html';

@customElement()
export class Froala {
  static inject = [AppConfig, TaskQueue];

  constructor(appConfig, taskQueue) {
    this.config = froalaDefaultConfig;
    this.appConfig = appConfig;
    this.taskQueue = taskQueue;
    this.defaultEventHandlers = {
      'froalaEditor.keyup': () => this.handleKeyup(),
      'froalaEditor.blur': () => this.handleBlur(),
      'froalaEditor.focus': () => this.handleFocus(),
      'froalaEditor.contentChanged': () => this.contentChanged(),
    };
    this.setEventHandlers();
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) value;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) config;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) validator;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) validationProperty;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) eventHandlers;

  bind() {
    this.value = sanitizeUserHtml(this.value);
    this.eventHandlersChanged(this.eventHandlers);
    this.configChanged(this.config);
  }

  eventHandlersChanged(newValue) {
    this.setEventHandlers(newValue);
  }

  configChanged(newValue) {
    if (!newValue) {
      this.taskQueue.queueMicroTask(() => {
        this.config = froalaDefaultConfig;
      });
      return;
    }
    const master = Object.assign({}, newValue);
    Object.assign(newValue, froalaDefaultConfig, master, {
      key: this.appConfig.froala.key,
    });
  }

  contentChanged() {
    this.value = this.froalaViewModel.instance.froalaEditor('html.get');
  }

  handleKeyup() {
    this.value = this.froalaViewModel.instance.froalaEditor('html.get');
  }

  handleBlur() {
    this.value = this.froalaViewModel.instance.froalaEditor('html.get');
    this.taskQueue.queueTask(() => {
      if (this.validator && this.validationProperty) {
        this.validator.validate(this.validationProperty);
      }
    });
  }

  handleFocus() {
    if (this.validator && this.validationProperty) {
      this.validator.clear(this.validationProperty);
    }
  }

  setEventHandlers(newValue) {
    const eventHandlers = newValue || {};
    this.mergedEventHandlers = {
      ...eventHandlers,
      ...this.defaultEventHandlers,
    };
  }
}
