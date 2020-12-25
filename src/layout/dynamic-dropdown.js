import { LogManager } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

export class DynamicDropdown {
  static inject = [Element, LogManager, EventAggregator];

  constructor(element, logManager, ea) {
    this.element = element;
    this.logger = logManager.getLogger();
    this.ea = ea;
  }

  activate(menuModel) {
    if (menuModel === undefined || menuModel === null) {
      this.logger.info('dynamic dropdown initialized with null/undefined model.');
      return;
    }
    this.title = menuModel.title;
    this.items = menuModel.items;
  }

  dispatchEvent(eventName) {
    this.ea.publish(eventName);
  }
}
