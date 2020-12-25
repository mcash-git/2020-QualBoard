# TwentyTwenty.QualBoard.Web

## Serving the Dev App Locally

### Requirements
 - Ensure that you have the latest version of [Node](https://nodejs.org/en/) 7.0+.

### Start It Up
Grab all the needed dependencies via npm:
```shell
npm i
```
Start the server:
```shell
npm run start
```
Browse to:
```
http://localhost:3001
```

## Export Production Bundle
In order to create a production bundle run:
```shell
npm run build
```
This will bundle the app into the `/dist` folder.
You can test the app by changing into the `/dist` folder and running:
```shell
http-server -p 3001
```

If it works on your machine, but breaks on the build server please quote:
>It works on my machine!

## Maintenance Mode

### Activating Maintenance Mode
Maintenance Mode is activated by setting the `MAINTENANCE` environment variable on the container:
- `TRUE` (case-insensitive) immediately activates maintenance mode. All new sessions will be taken to the "Under Maintenance" page.
- A [ISO-8601](http://coderstoolbox.net/unixtimestamp/) timestamp will show a message to users until the set time and then new sessions will be shown the the "Under Maintenance" page.
- Any other value will disable maintenance mode.

### Bypassing Maintenance Mode
Maintenance mode can be bypassed from the browser console:
- `window.overrideMaintenance()`-> bypass maintenance mode forever
- `window.overrideMaintenance(24)` -> bypass maintenance mode for 24 hours
- `window.clearMaintenanceOverride()` -> remove maintenance mode override

## Bundle Configuration

#### Environment Variables
These are the environment variables under use and the fallbacks for each one.

 - API_URL: `https://api-dev.qualboard.com/api`
 - API_BASE_URL: `https://api-dev.qualboard.com`
 - IDENTITY_URL: `https://alpha.2020identity.com`
 - IDENTITY_CLIENTID: `1473447706.apps.2020identity.com`
 - REDIRECT_URI: `http://localhost:3001/#/oidc/#`
 - POSTLOGOUT_REDIRECT_URI: `localhost:3001`
 - SILENT_REDIRECT_URI:`http://localhost:3001/silent-renew.html`
 - URL: `localhost:3001`
 - MEDIA_URL: `https://media-alpha.2020ip.io`
 - MEDIA_IMAGE_URI_BASE: `https://media-alpha.2020ip.io`
 - MEDIA_URL_ROUTE: `/api/amazon/sign`
 - MEDIA_AWSKEY: `AKIAJWEIL4JDHIQDMWSQ`
 - MEDIA_BUCKET: `twentytwenty.us-east-1.alpha`
 - MEDIA_AWS_URL: `https://s3.amazonaws.com`

## Webpack Details
Internal [webpack.config wiki link](https://github.com/2020IP/TwentyTwenty.QualBoard.Web/wiki/Webpack-Config-Wiki). If you make large changes please update this wiki, webpack can be a cold world.

## Dependent 2020 Repos
- 2020-analytics: https://github.com/2020IP/2020-analytics,
- 2020-annotations: https://github.com/2020IP/2020-annotations,
- 2020-aurelia: https://github.com/2020IP/2020-aurelia,
- 2020-aurelia-bulk-import: https://github.com/2020IP/2020-aurelia-bulk-import,
- 2020-identity: https://github.com/2020IP/2020-identity,
- 2020-media: https://github.com/2020IP/2020-media,
- 2020-messaging: https://github.com/2020IP/2020-messaging,
- 2020-qb4: https://github.com/2020IP/2020-qb4,
- 2020-servereventclient: https://github.com/2020IP/2020-servereventclient,
- 2020-videojs-annotations: https://github.com/2020IP/2020-videojs-annotations
