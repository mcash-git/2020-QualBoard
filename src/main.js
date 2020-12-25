import { LogManager } from 'aurelia-framework';
import { ConsoleAppender } from 'aurelia-logging-console';
import { AuthManager } from 'shared/auth/auth-manager';
import { MaintenanceMode } from 'maintenance';
import { ContainerState } from 'container-state';
import { configureContainer } from 'ioc';

import 'event-source-polyfill';
import 'whatwg-fetch';
import 'active-tab';
import 'bootstrap';
import 'babel-polyfill';
import 'sass-imports';

// required - do not remove:
import * as froala from 'froala-editor/js/froala_editor.pkgd.min.js'; // eslint-disable-line
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'react-select/dist/react-select.css';

function configurePlugins(aurelia) {
  aurelia.use
    // if the css animator is enabled, add swap-order="after" to all router-view elements
    .feature('shared/features/aurelia-date-time-format')
    .feature('shared/features/aurelia-drop')
    .plugin('aurelia-animator-css')
    .plugin('2020-aurelia')
    .plugin('2020-aurelia-bulk-import')
    .plugin('aurelia-dialog', config => {
      config.useDefaults();
      config.settings.lock = false;
      config.settings.startingZIndex = 1100;
    })
    .plugin('aurelia-ui-virtualization')
    .plugin('aurelia-froala-editor');
}

function configureGlobalResources(aurelia) {
  aurelia.use
    .globalResources(
      'shared/value-converters/date-format',
      'shared/value-converters/moment-format',
      'shared/value-converters/debug-json-format',
      'shared/value-converters/decimal',
      'shared/value-converters/integer-value-converter',
      'shared/value-converters/strip-html',
      'shared/value-converters/sanitize-value-converter',
      'shared/value-converters/bytes-to-human-value-converter',
      'shared/value-converters/relative-date-format',
      'shared/value-converters/entry-overview-value-converter',
      'shared/value-converters/format-seconds-value-converter',
      'shared/components/date-time-picker',
      'shared/components/date-picker',
      'shared/components/avatar',
      // TODO:  Make this a plug-in or feature.
      'shared/tag-input',
      'shared/components/froala',
      'shared/components/fade-in-attribute',
      'shared/components/tooltip-attribute',
      'shared/components/checkbox-tree',
      'shared/media/asset-thumbnail',
      'shared/media/video-player',
    );
}

export async function configure(aurelia) {
  try {
    LogManager.addAppender(new ConsoleAppender());
    LogManager.setLevel(LogManager.logLevel.error);

    window.containerState = new ContainerState();

    const maintenance = new MaintenanceMode();
    if (maintenance.isEnabled) { return; }

    const authManager = new AuthManager();

    await authManager.handleAuthFlow();
    if (!await authManager.oidcWrapper.isUserLoggedIn()) {
      return;
    }

    authManager.um.clearStaleState();
    aurelia.use.standardConfiguration();

    configurePlugins(aurelia);
    configureGlobalResources(aurelia);
    await configureContainer(aurelia.container, authManager);

    aurelia.start().then(() => aurelia.setRoot('layout/app'));
  } catch (e) {
    const appDiv = document.querySelector('body > div.app');
    const maintenanceSplashDiv = document.getElementById('maintenance-splash');

    appDiv.style.display = 'none';
    maintenanceSplashDiv.style.display = 'block';
  }
}
