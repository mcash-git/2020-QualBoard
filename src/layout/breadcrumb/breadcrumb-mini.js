import Drop from 'tether-drop/dist/js/drop.js';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';

export class BreadcrumbMini {
  static inject = [EventAggregator, Router];

  constructor(ea, router) {
    this.ea = ea;
    this.router = router;
  }
  activate(model) {
    this.routes = model.routes.reverse()
      .filter(r => r.config.settings && r.config.settings.breadIcon && !r.config.settings.hideMini);
  }

  attached() {
    this.setupDrop();
    this.subscription = this.ea.subscribe(
      'router:navigation:complete',
      ::this.navigationSuccess,
    );
  }
  
  unbind() {
    this.subscription.dispose();
    this.drop.destroy();
  }

  setupDrop() {
    const target = this.dropTarget;
    const content = this.dropBody;
    /* eslint-disable */
    this.drop = new Drop ({
      target,
      content,
      position: 'bottom center',
      remove: true,
      openOn: 'click',
      classes: 'drop-theme-filters',
    });
    /* eslint-enable */
  }

  closeDrop() {
    this.drop.close();
  }

  goHome() {
    this.closeDrop();
    this.router.navigateToRoute('home');
  }

  navigationSuccess() {
    this.drop.destroy();
    setTimeout(() => { this.setupDrop(); }, 300);
  }
}
